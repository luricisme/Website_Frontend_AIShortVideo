import { Composition } from 'remotion';
import VideoComposition from './VideoComposition';

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="VideoComposition"
                component={VideoComposition}
                durationInFrames={1800}
                fps={60}
                width={540}
                height={960}
        />
        </>
);
};
