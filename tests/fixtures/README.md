# Voice fixtures

Audio fixtures for the STT integration test (`tests/transcribe.integration.test.ts`).

Both files are gitignored — record your own.

## Recording `voice.ogg` in Firefox

Open Firefox, open the JS console on any page, paste, and run:

```js
navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
  const rec = new MediaRecorder(stream);
  const chunks = [];
  rec.ondataavailable = (e) => chunks.push(e.data);
  rec.onstop = () => {
    const blob = new Blob(chunks, { type: rec.mimeType });
    console.log("mimeType:", rec.mimeType, "bytes:", blob.size);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "voice.ogg";
    a.click();
    stream.getTracks().forEach((t) => t.stop());
  };
  rec.start();
  setTimeout(() => rec.stop(), 4000);
});
```

Speak clearly for ~4 seconds. Move the downloaded file to
`tests/fixtures/voice.ogg`.

## Optional: assert on content

Create `tests/fixtures/voice.expected.txt` with a short phrase from your
recording. The test does a case-insensitive substring match — keep it short and
unambiguous (e.g. `"my dog"`).

Without this file, the test only asserts the transcript is non-empty.
