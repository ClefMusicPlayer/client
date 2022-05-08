import Queue from "./Queue";

const API_URL = "https://ytmusic-interactions.blitzsite.repl.co/";

interface Song {
  artists: string[];
  id: string;
  length: string;
  link: string;
  thumbnail: {
    large: string;
    mini: string;
  };
  title: string;
}

export async function getRecomendations(songId: string): Promise<Queue<Song>> {
  return fetch(`${API_URL}recommendations?video_id=${songId}`)
    .then((response) => response.json())
    .then((data) => {
      const queue = Queue.from(data as Song[]);
      return queue;
      // this.cache.current.index = 0;
      // this.loadRecommendationsIntoUI();
      // this.downloadIndex(this.cache.current.index, (blobUrl) => {
      //   this.cache.current.blobUrl = blobUrl;
      //   this.audio.src = this.cache.current.blobUrl;
      //   this.UI.download.href = this.cache.current.blobUrl;
      //   this.UI.download.classList.remove("disabled");
      //   this.audio.load();
      //   console.log(this.recom[this.cache.current.index].title);
      //   this.updateUI(this.recom[this.cache.current.index]);
      // });
      // this.cache.next.index = 1;
      // this.downloadIndex(this.cache.next.index, (blobUrl) => {
      //   this.cache.next.blobUrl = blobUrl;
      // });
    })
    .catch((error) => {
      console.error(error);
      return Queue.from([]);
    });
}

// TODO: Create caching logic with indexxedDB here maybe?
export async function downloadSong(
  songId: string,
  cache: Map<string, string>
): Promise<string> {
  const cacheHit = cache.get(songId);
  if (cacheHit) {
    return cacheHit;
  }
  return fetch(`${API_URL}download?video_id=${songId}`)
    .then((x) => x.blob())
    .then((x) => {
      const blobUrl = URL.createObjectURL(x);
      cache.set(songId, blobUrl);
      return blobUrl;
    });
}
export type { Song };
