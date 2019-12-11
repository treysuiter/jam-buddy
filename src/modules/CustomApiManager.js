import ApiManager from "./ApiManager"

export default {

addNewSongToDatbase() {
  const song = {
    songTitle: this.state.songTitle,
    artistName: this.state.artistName,
    deezerId: ""
  }
  ApiManager.post("songs", song)
}

}