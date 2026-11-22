<?php

use PHPUnit\Framework\TestCase;

/**
 * PLAN DE TEST - Créneaux proposés à l'élève (FLE-113)
 *
 * Objectif : l'élève voit les créneaux de SA journée (00:00 → 24:00 dans son fuseau), quels que soient
 * son fuseau et la date. Les dates ci-dessous ne servent qu'à couvrir chaque situation d'heure
 * (heure d'hiver / d'été à Paris, pays sans changement d'heure, pays qui changent à d'autres dates).
 * Cas testés :
 * - CS01 : Tokyo, jour où Paris est à l'heure d'hiver : la journée couvre deux jours de Paris
 * - CS02 : Tokyo, jour où Paris est à l'heure d'été : même règle, autre écart
 * - CS03 : Los Angeles : le 8 h 30 de Paris tombe la veille, sauf quand seuls les États-Unis ont changé d'heure
 * - CS04 : Paris et New York : mêmes créneaux qu'avant FLE-113, y compris quand l'écart Paris – New York change
 * - CS05 : jours de changement d'heure : ni doublon ni trou
 * - CS06 : heure qui existe deux fois chez l'élève (Sydney, retour à l'heure d'hiver) : créneaux écartés
 * - CS07 : occupation Google qui ne commence pas sur un quart d'heure : chevauchement détecté
 * - CS08 : un cours tient entièrement dans une plage (durées, pauses, jour fermé)
 * - CS09 : délai minimum de 8 h
 * - CS10 : validation des paramètres (date, fuseau, durée)
 */
class ControllerCalendarSlotsTest extends TestCase
{
    private const PARIS = 'Europe/Paris';

    private function ranges(string $start = '08:30', string $end = '21:30'): array
    {
        return array_fill_keys(range(1, 7), [[$start, $end]]);
    }

    /** @return list<DateTimeImmutable> */
    private function slots(string $date, string $tz, int $duration = 30, ?array $ranges = null, array $busy = [], string $now = '2026-01-01 00:00:00'): array
    {
        return ControllerCalendar::computeAvailableSlots(
            $date,
            new DateTimeZone($tz),
            $duration,
            $ranges ?? $this->ranges(),
            new DateTimeZone(self::PARIS),
            $busy,
            new DateTimeImmutable($now, new DateTimeZone('UTC'))
        );
    }

    /** @return list<string> heures affichées à l'élève */
    private function labels(array $slots): array
    {
        return array_map(fn(DateTimeImmutable $s) => $s->format('H:i'), $slots);
    }

    /** @return list<string> mêmes créneaux, en heure de Paris */
    private function paris(array $slots): array
    {
        return array_map(fn(DateTimeImmutable $s) => $s->setTimezone(new DateTimeZone(self::PARIS))->format('D H:i'), $slots);
    }

    /** Liste « HH:MM » de $from à $to inclus, par pas de 15 min. */
    private function grid(string $from, string $to): array
    {
        $out = [];
        $t = new DateTimeImmutable("2000-01-01 $from");
        $end = new DateTimeImmutable("2000-01-01 $to");
        while ($t <= $end) {
            $out[] = $t->format('H:i');
            $t = $t->modify('+15 minutes');
        }
        return $out;
    }

    private function find(array $slots, string $label): DateTimeImmutable
    {
        foreach ($slots as $slot) {
            if ($slot->format('H:i') === $label) {
                return $slot;
            }
        }
        $this->fail("Créneau $label absent");
    }

    // CS01
    public function testTokyoWhenParisIsOnWinterTime(): void
    {
        $slots = $this->slots('2026-12-01', 'Asia/Tokyo');

        $this->assertSame(array_merge($this->grid('00:00', '05:00'), $this->grid('16:30', '23:45')), $this->labels($slots));
        $this->assertSame('Mon 16:00', $this->paris($slots)[0]);

        // Le bogue d'origine : « 04:00 » réservait lundi 20 h Paris pour un élève qui voulait… mardi 04:00. C'est désormais le même instant.
        $slot = $this->find($slots, '04:00');
        $this->assertSame('2026-12-01 04:00', $slot->format('Y-m-d H:i'));
        $this->assertSame('2026-11-30 20:00', $slot->setTimezone(new DateTimeZone(self::PARIS))->format('Y-m-d H:i'));
    }

    // CS02
    public function testTokyoWhenParisIsOnSummerTime(): void
    {
        $slots = $this->slots('2026-06-02', 'Asia/Tokyo');

        $this->assertSame(array_merge($this->grid('00:00', '04:00'), $this->grid('15:30', '23:45')), $this->labels($slots));
        $this->assertSame('Mon 17:00', $this->paris($slots)[0]);
    }

    // CS03
    public function testLosAngeles(): void
    {
        // Écart habituel : le mardi 8 h 30 de Paris est le lundi 23:30 à Los Angeles.
        $monday = $this->slots('2026-11-30', 'America/Los_Angeles');
        $this->assertSame('23:30', $this->labels($monday)[count($monday) - 2]);
        $this->assertSame('Tue 08:30', $this->paris($monday)[count($monday) - 2]);
        $tuesday = $this->slots('2026-12-01', 'America/Los_Angeles');
        $this->assertNotContains('Tue 08:30', $this->paris($tuesday));
        $this->assertSame('00:00', $this->labels($tuesday)[0]);

        // Mars : les États-Unis ont changé d'heure, pas encore la France. Le 8 h 30 de Paris tombe le même jour.
        $this->assertNotContains('Tue 08:30', $this->paris($this->slots('2026-03-09', 'America/Los_Angeles')));
        $tuesdayMarch = $this->slots('2026-03-10', 'America/Los_Angeles');
        $this->assertSame('00:30', $this->labels($tuesdayMarch)[0]);
        $this->assertSame('Tue 08:30', $this->paris($tuesdayMarch)[0]);
    }

    // CS04
    public function testParisAndNewYorkUnchanged(): void
    {
        $this->assertSame($this->grid('08:30', '21:00'), $this->labels($this->slots('2026-12-01', self::PARIS)));
        $this->assertSame($this->grid('08:30', '21:00'), $this->labels($this->slots('2026-07-07', self::PARIS)));

        $this->assertSame($this->grid('02:30', '15:00'), $this->labels($this->slots('2026-12-01', 'America/New_York')));
        // Semaines où l'écart Paris – New York est de 5 h au lieu de 6 h.
        $this->assertSame($this->grid('03:30', '16:00'), $this->labels($this->slots('2026-03-10', 'America/New_York')));
        $this->assertSame($this->grid('03:30', '16:00'), $this->labels($this->slots('2026-10-27', 'America/New_York')));
    }

    // CS05
    public function testDaylightSavingDaysHaveNoDuplicateNorGap(): void
    {
        foreach (['2026-03-29', '2026-10-25'] as $date) {
            $this->assertSame($this->grid('08:30', '21:00'), $this->labels($this->slots($date, self::PARIS)), $date);
        }

        foreach ([['2026-03-29', 'Asia/Tokyo'], ['2026-10-25', 'Asia/Tokyo'], ['2026-03-08', 'America/New_York'], ['2026-11-01', 'America/New_York']] as [$date, $tz]) {
            $slots = $this->slots($date, $tz);
            $this->assertNotEmpty($slots);
            for ($i = 1; $i < count($slots); $i++) {
                $this->assertGreaterThanOrEqual(15 * 60, $slots[$i]->getTimestamp() - $slots[$i - 1]->getTimestamp(), "$tz $date");
            }
            $this->assertSame(count($slots), count(array_unique($this->labels($slots))), "$tz $date : libellé en double");
            foreach ($slots as $slot) {
                $this->assertSame($date, $slot->format('Y-m-d'), "$tz $date : créneau hors de la journée de l'élève");
            }
        }

        // Tokyo, dimanche 29/03 : samedi 16 h → dimanche 17 h à Paris (Paris change d'heure dans la nuit).
        $tokyo = $this->slots('2026-03-29', 'Asia/Tokyo');
        $this->assertSame(array_merge($this->grid('00:00', '05:00'), $this->grid('15:30', '23:45')), $this->labels($tokyo));
    }

    // CS06
    public function testAmbiguousLocalHourIsSkipped(): void
    {
        // Sydney recule d'une heure le dimanche 5/04/2026 : 02:00 – 02:59 existe deux fois (samedi 17 h – 19 h à Paris).
        $labels = $this->labels($this->slots('2026-04-05', 'Australia/Sydney'));
        foreach (['02:00', '02:15', '02:30', '02:45'] as $ambiguous) {
            $this->assertNotContains($ambiguous, $labels);
        }
        $this->assertContains('01:45', $labels);
        $this->assertContains('03:00', $labels);
        $this->assertSame(count($labels), count(array_unique($labels)));
    }

    // CS07
    public function testBusyPeriodNotAlignedOnQuarterBlocksOverlappingSlots(): void
    {
        $utc = new DateTimeZone('UTC');
        $busy = [[new DateTimeImmutable('2026-12-01 09:05:00', $utc), new DateTimeImmutable('2026-12-01 09:50:00', $utc)]]; // 10 h 05 – 10 h 50 Paris
        $labels = $this->labels($this->slots('2026-12-01', self::PARIS, 30, null, $busy));

        foreach (['09:45', '10:00', '10:15', '10:30', '10:45'] as $taken) {
            $this->assertNotContains($taken, $labels);
        }
        $this->assertContains('09:30', $labels);
        $this->assertContains('11:00', $labels);
    }

    // CS08
    public function testAppointmentFitsEntirelyInARange(): void
    {
        $this->assertSame('21:00', $this->labels($this->slots('2026-12-01', self::PARIS, 30))[50]);
        $this->assertSame('20:45', array_slice($this->labels($this->slots('2026-12-01', self::PARIS, 45)), -1)[0]);
        $this->assertSame('20:30', array_slice($this->labels($this->slots('2026-12-01', self::PARIS, 60)), -1)[0]);

        // Plages avec pause, et dimanche fermé (préparation de FLE-32).
        $ranges = array_fill_keys(range(1, 6), [['09:00', '12:00'], ['13:00', '17:30']]);
        $ranges[7] = [];
        $monday = $this->labels($this->slots('2026-11-30', self::PARIS, 60, $ranges));
        $this->assertContains('11:00', $monday);
        $this->assertNotContains('11:15', $monday);
        $this->assertNotContains('12:00', $monday);
        $this->assertContains('13:00', $monday);
        $this->assertSame('16:30', array_slice($monday, -1)[0]);
        $this->assertSame([], $this->slots('2026-11-29', self::PARIS, 30, $ranges));
    }

    // CS09
    public function testMinimumDelayOfEightHours(): void
    {
        // Maintenant : mardi 1/12 8 h Paris → premier cours possible à 16 h.
        $slots = $this->slots('2026-12-01', self::PARIS, 30, null, [], '2026-12-01 07:00:00');
        $this->assertSame('16:00', $this->labels($slots)[0]);
        $this->assertSame([], $this->slots('2026-11-30', self::PARIS, 30, null, [], '2026-12-01 07:00:00'));
    }

    // CS10
    public function testRequestValidation(): void
    {
        $valid = ['date' => '2026-12-01', 'userTimeZone' => 'Asia/Tokyo', 'selectedDuration' => '30'];
        $this->assertNull(ControllerCalendar::validateSlotsRequest($valid));
        $this->assertNull(ControllerCalendar::validateSlotsRequest(['selectedDuration' => 45] + $valid));
        $this->assertNull(ControllerCalendar::validateSlotsRequest(['userTimeZone' => 'Asia/Kolkata'] + $valid));
        // Anciens noms encore renvoyés par certains navigateurs : acceptés dès que la base de fuseaux de PHP les connaît
        // (c'est le cas de l'image php officielle ; certaines distributions les livrent à part).
        try {
            new DateTimeZone('Asia/Calcutta');
            $this->assertNull(ControllerCalendar::validateSlotsRequest(['userTimeZone' => 'Asia/Calcutta'] + $valid));
        } catch (Exception $e) {
        }

        foreach (['2026-02-30', '01/12/2026', '2026-12-01 10:00', '', null, ['x']] as $date) {
            $this->assertNotNull(ControllerCalendar::validateSlotsRequest(['date' => $date] + $valid), json_encode($date));
        }
        foreach (['+02:00', 'CEST', 'Mars/Olympus', '', null, 3] as $tz) {
            $this->assertNotNull(ControllerCalendar::validateSlotsRequest(['userTimeZone' => $tz] + $valid), json_encode($tz));
        }
        foreach (['20', '30.5', 'abc', 0, -30, null, '1e9'] as $duration) {
            $this->assertNotNull(ControllerCalendar::validateSlotsRequest(['selectedDuration' => $duration] + $valid), json_encode($duration));
        }
        $this->assertNotNull(ControllerCalendar::validateSlotsRequest([]));
    }
}
