export default {
    payment: {
        title: "支払い",
        description: "支払いを完了して予約を確定します。",
        successMessage: "お支払いは正常に完了しました。ご予約が確定しました。",
        successMessageWallet: "ウォレットでの支払いに成功しました！ご予約が確定しました。",
        errorMessage:
            "お支払いに問題が発生しました。問題が解決しない場合は、もう一度試すか、サポートにお問い合わせください。",
        processingMessage: "お支払いを処理しています。お待ちください...",
        error: "エラー",
        paymentInformationsNotFound: "支払い情報が見つかりません。",
        missingPaymentInformations: "支払い情報がありません。もう一度試してください。",
        returnToCalendar: "カレンダーに戻る",
        successFullPayment: "支払いが成功しました！",
        missingCheck: "支払いの確認中にエラーが発生しました。",
        processing: "お支払いを処理しています。お待ちください...",
        redirectToCalendar: "数秒後にカレンダーにリダイレクトします...",
        retryPayment: "支払いを再試行する",
    },
} as const;
