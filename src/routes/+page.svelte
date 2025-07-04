<script lang="ts">
  let file: File | null = null;
  let expire = 'forever';
  let result: any = null;
  let loading = false;

  async function upload() {
    if (!file) return alert("Pilih file dulu");
    loading = true;
    const form = new FormData();
    form.append("file", file);
    form.append("expire", expire);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: form
    });
    result = await res.json();
    loading = false;
  }
</script>

<style>
  main {
    text-align: center;
    font-family: sans-serif;
    color: white;
    background: #111;
    padding: 2rem;
  }
  .box {
    max-width: 600px;
    margin: auto;
    background: #1e1e1e;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 0 20px red;
  }
  select, input[type="file"], button {
    margin: 1rem 0;
    padding: 0.6rem;
    font-size: 1rem;
  }
  .url {
    margin-top: 1rem;
    word-break: break-all;
    color: lime;
  }
</style>

<main>
  <div class="box">
    <h1>GATTBOX 🔥</h1>
    <p>Upload media (image/audio/video/gif) dan jadikan URL</p>
    <input type="file" bind:files={file} on:change={e => file = e.target.files[0]} />
    <br />
    <label>Durasi Tautan:</label>
    <select bind:value={expire}>
      <option value="forever">Tidak Terbatas</option>
      <option value="10s">10 Detik</option>
      <option value="1m">1 Menit</option>
      <option value="10m">10 Menit</option>
      <option value="1h">1 Jam</option>
      <option value="1d">1 Hari</option>
    </select>
    <br />
    <button on:click={upload} disabled={loading}>
      {loading ? 'Uploading...' : 'Upload'}
    </button>

    {#if result}
      <div class="url">
        <p>✅ Upload Berhasil!</p>
        <a href={result.data.url} target="_blank">{result.data.url}</a>
      </div>
    {/if}
  </div>
</main>
