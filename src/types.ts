export interface ServerToClientEvents {
    connectSignaling: (data: { room: string, candidate: RTCIceCandidate | null, sdp: RTCSessionDescription | null }) => void
    broadcast: (message: string) => void
  }

export interface ClientToServerEvents {
    joinRoom: (messageData:{ room: string }) => void
    connectSignaling: (data: { room: string, candidate: RTCIceCandidate | null, sdp: RTCSessionDescription | null }) => void
  }
