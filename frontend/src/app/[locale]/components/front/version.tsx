type versionProps = {
    document: string;
    version: string;
};

export default function Version({ document, version }: versionProps) {
    return (
        <div className="text-right pr-4 text-sm text-gray-500 dark:text-gray-400">
            {document} - Version {version}
        </div>
    );
}
