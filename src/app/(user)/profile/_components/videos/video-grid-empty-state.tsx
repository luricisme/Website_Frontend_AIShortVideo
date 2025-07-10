const EmptyState = ({ message }: { message: string }) => (
    <div className="mt-6 text-center py-12">
        <div className="text-zinc-400 text-lg mb-2">{message}</div>
        <div className="text-zinc-500 text-sm">No video has been uploaded</div>
    </div>
);

export default EmptyState;
