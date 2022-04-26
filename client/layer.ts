export enum Layer {
    MediaSource
}

export const getMediaSource = () =>
    navigator.mediaDevices.getDisplayMedia({
        audio: false,
        video: {
            height: 1080,
            width: 1920
        }
    })
