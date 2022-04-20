export enum Layer {
    MediaSource
}

export const getMediaSource = () =>
    navigator.mediaDevices.getDisplayMedia({
        audio: false,
        video: {
            width: 1080,
            height: 1920
        }
    })
