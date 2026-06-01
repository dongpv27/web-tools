// One-shot patch: inject exampleOutput + seoContent into 21 video tools.

import fs from 'node:fs';

const FILE = 'src/lib/tools.ts';
let src = fs.readFileSync(FILE, 'utf8');

const DATA = {
  'video-to-gif': {
    exampleOutput: {
      input: 'product-demo.mp4 (12s clip @ 1920×1080, 30fps)',
      output: 'product-demo.gif — 12s @ 480×270, 15fps, ~2.4 MB',
      description: 'Optimised GIF: resized to web-friendly width, frame rate halved, palette reduced to keep file size sane while preserving smooth motion.',
    },
    seo: {
      intro: 'Turn any video clip into an optimised animated GIF entirely in your browser — no upload, no account. Pick the segment, width, frame rate, and palette size, and the encoder produces a GIF small enough to drop into emails, GitHub issues, Slack, or blog posts without external image hosting.',
      examples: [
        { title: 'Bug-report GIF', body: 'A 6-second screen recording becomes a 480-px-wide, 12 fps GIF under 1 MB — easy to paste straight into a GitHub issue.' },
        { title: 'Product showcase loop', body: 'Trim a 12-second demo highlight and export at 15 fps for a smooth, attention-grabbing loop on a landing page.' },
        { title: 'Slack reaction GIF', body: 'Pick the funny 2-second moment from a longer clip, set 320 px width, and the GIF is light enough to drop into any chat.' },
      ],
      useCases: [
        'Visual bug reports in GitHub / Jira / Linear',
        'Product demo loops on landing pages and emails',
        'Lightweight tutorials embedded in docs (no video player needed)',
        'Reaction GIFs / memes for team chat',
        'Auto-playing previews for portfolios and case studies',
      ],
      troubleshooting: [
        { problem: 'GIF is huge (>10 MB)', solution: 'Reduce width to 480 or 320 px, drop frame rate to 10-15 fps, or shorten the clip. GIF compression scales badly with resolution and frame count.' },
        { problem: 'Colours look posterised / banded', solution: 'Bump the palette size from 64 to 128 or 256 colours. GIF is limited to 256 colours per frame — gradient-heavy clips need the full palette.' },
        { problem: 'Motion looks jerky', solution: 'Increase frame rate (try 15-20 fps) and avoid trimming the source frame rate too aggressively. Below 10 fps fast motion becomes choppy.' },
      ],
    },
  },
  'compress-video': {
    exampleOutput: {
      input: 'vacation.mp4 (1.2 GB, 1080p H.264, CRF 18)',
      output: 'vacation-compressed.mp4 (240 MB, 1080p H.264, CRF 28) — 80% smaller',
      description: 'Re-encodes with a tunable CRF (Constant Rate Factor). 23-28 is the sweet spot — visually near-lossless at half the size or less.',
    },
    seo: {
      intro: 'Shrink video file size without uploading the file anywhere. The tool runs FFmpeg in your browser via WebAssembly, re-encoding with H.264 (or H.265 / VP9) at a quality level you control. Typical 4-10× size reduction with no perceptible quality loss at CRF 23-28.',
      examples: [
        { title: 'Email-attachment fit', body: 'A 1.2 GB phone clip compresses to 90 MB — fits inside a 100 MB Gmail attachment limit with quality intact.' },
        { title: 'Cloud-storage savings', body: 'A folder of 50 family videos halves in size after batch compression, freeing GB of Google Drive / iCloud space.' },
        { title: 'Faster uploads', body: 'A 4K screen recording shrinks 75% before uploading to YouTube — same final quality, 4× faster upload.' },
      ],
      useCases: [
        'Fitting videos into email / chat attachment limits',
        'Reducing cloud-storage footprint',
        'Speeding up uploads to YouTube / Vimeo / social media',
        'Preparing videos for low-bandwidth viewers',
        'Archiving home videos without losing quality',
      ],
      troubleshooting: [
        { problem: 'Output looks soft or blocky', solution: 'CRF is too high — lower it (smaller number = better quality). Try CRF 23 for visually lossless, 28 for "good enough" web quality.' },
        { problem: 'Compression takes forever', solution: 'WASM FFmpeg is single-threaded. For large 4K files, drop resolution to 1080p before compressing, or use the "fast" preset (smaller savings, much faster).' },
        { problem: 'Audio out of sync after compression', solution: 'Switch container to MP4 (not MKV) and pick AAC audio. Rare A/V drift is usually a container-level issue, not codec-level.' },
      ],
    },
  },
  'mp4-to-mp3': {
    exampleOutput: {
      input: 'lecture.mp4 (1h20m, 720p with narration)',
      output: 'lecture.mp3 (1h20m, 128 kbps stereo, ~73 MB)',
      description: 'Audio extracted and re-encoded as MP3 at your chosen bitrate (96-320 kbps). Original video discarded — output is audio-only.',
    },
    seo: {
      intro: 'Extract the audio track from any MP4 video and save it as an MP3 — perfect for turning lectures, podcasts, interviews, and music videos into audio-only files you can listen to on a phone, in a car, or in any media player. Runs locally; nothing uploaded.',
      examples: [
        { title: 'Lecture-as-podcast', body: 'A 1h20m university lecture becomes a 73 MB MP3 you can sync to a phone for commute listening.' },
        { title: 'Interview transcription prep', body: 'Strip a 2-hour interview down to audio-only and feed it to a transcription service (Whisper, Otter, etc.) at a fraction of the file size.' },
        { title: 'Music-video → MP3', body: 'Pull the audio out of a music video for your personal listening collection (only for content you own / have rights to).' },
      ],
      useCases: [
        'Converting lectures and tutorials into podcasts',
        'Preparing interviews for transcription services',
        'Listening to video content during commute / exercise',
        'Reducing storage by keeping only the audio',
        'Extracting music from concert recordings (own content)',
      ],
      troubleshooting: [
        { problem: 'MP3 file is huge', solution: 'Lower the bitrate. 128 kbps is fine for spoken word; 192-256 kbps for music. 320 kbps is overkill for most non-music content.' },
        { problem: 'Output sounds muffled', solution: 'Bitrate too low (e.g. 64 kbps). Bump to 128+ kbps. If the source video already had bad audio, MP3 can\'t fix it.' },
        { problem: 'Only one channel has sound', solution: 'Source was mono with sound on one channel. Toggle "downmix to mono" so the output plays through both channels.' },
      ],
    },
  },
  'trim-video': {
    exampleOutput: {
      input: 'meeting-recording.mp4 (1h05m total)',
      output: 'meeting-key-moment.mp4 — pages 00:12:30 to 00:15:45 (3m15s, MP4)',
      description: 'Lossless stream-copy trim when start/end land on keyframes (instant). Otherwise re-encodes the trimmed section with same codec settings.',
    },
    seo: {
      intro: 'Cut a precise segment out of any video without re-encoding the rest of the file. The trimmer uses stream-copy when possible (instant, zero quality loss) and falls back to frame-accurate re-encoding only for the boundary frames. Enter times in hh:mm:ss or scrub on the timeline.',
      examples: [
        { title: 'Highlight clip', body: 'Pull the 3-minute key moment out of a 1-hour meeting recording for the project Slack channel.' },
        { title: 'Social-media cut', body: 'Trim a 90-second hook from a longer YouTube video to repost on Instagram Reels / TikTok.' },
        { title: 'Remove intro/outro', body: 'Cut a 5-second sponsor outro off the end of every episode before archiving.' },
      ],
      useCases: [
        'Pulling highlights from long meetings / lectures',
        'Creating short clips for social media',
        'Removing intros / outros / ad breaks',
        'Extracting interviewable soundbites',
        'Building demo reels from longer footage',
      ],
      troubleshooting: [
        { problem: 'Output starts a few frames before the requested time', solution: 'Stream-copy trims snap to the previous keyframe to avoid re-encoding. Enable "frame-accurate" mode to re-encode the boundary for exact timing.' },
        { problem: 'Times entered in seconds get rejected', solution: 'The input expects hh:mm:ss (or mm:ss). Type 00:01:30 for 1m30s, not 90. The format matches the player\'s timeline display.' },
        { problem: 'Audio glitch at the start of the trim', solution: 'Audio frames don\'t align perfectly with video keyframes. Re-encode with frame-accurate mode to clean up the boundary.' },
      ],
    },
  },
  'crop-video': {
    exampleOutput: {
      input: 'landscape-footage.mp4 (1920×1080, 16:9)',
      output: 'vertical-cut.mp4 (608×1080, 9:16) — centre column cropped',
      description: 'Drag the crop rectangle directly on the preview frame or enter exact pixel coordinates. Common aspect-ratio presets (9:16, 1:1, 4:5, 4:3) included.',
    },
    seo: {
      intro: 'Crop unwanted edges from a video — black bars, off-camera framing mistakes, or reformatting from landscape to vertical for social media. Drag the crop rectangle directly on the preview, or enter pixel-perfect coordinates. Includes aspect-ratio presets for Instagram (1:1, 4:5), TikTok / Reels (9:16), and YouTube (16:9).',
      examples: [
        { title: 'Landscape → vertical reel', body: 'A 1920×1080 horizontal video crops to 608×1080 9:16 for an Instagram Reel, keeping the centre column where the subject is framed.' },
        { title: 'Square Instagram post', body: 'A 16:9 video crops to 1:1 (1080×1080) for an in-feed Instagram post — black bars avoided.' },
        { title: 'Remove watermark', body: 'Crop out a corner watermark by setting the crop box just outside it (only for content you own / have rights to alter).' },
      ],
      useCases: [
        'Reformatting horizontal videos for TikTok / Reels',
        'Producing square videos for Instagram / LinkedIn feeds',
        'Cropping out black bars from letterboxed source',
        'Removing off-frame distractions',
        'Tight-framing the subject for thumbnail-style clips',
      ],
      troubleshooting: [
        { problem: 'Subject is off-centre after crop', solution: 'Use the "smart-centre" toggle to auto-detect face/person and re-anchor the crop on them, instead of always using the geometric centre.' },
        { problem: 'Output is the same size as the source', solution: 'Pixel coordinates may have defaulted to full frame. Drag the corners inward, or pick an aspect-ratio preset.' },
        { problem: 'Aspect ratio looks distorted', solution: 'Crop never stretches — it only removes pixels. If video looks squished, the source has non-square pixel aspect ratio; enable "fix PAR" before cropping.' },
      ],
    },
  },
  'resize-video': {
    exampleOutput: {
      input: 'screen-recording.mp4 (3840×2160, 4K, 280 MB)',
      output: 'screen-recording.mp4 (1920×1080, 1080p, ~78 MB)',
      description: 'Resizes to your chosen resolution or scale percentage, preserving aspect ratio. Bicubic / Lanczos filter for sharp downscales.',
    },
    seo: {
      intro: 'Resize any video to a specific resolution (1080p, 720p, 480p) or a percentage of the original — useful for shrinking 4K clips to a web-friendly 1080p, generating multiple sizes for adaptive streaming, or simply reducing file size. Bicubic / Lanczos scaling preserves sharpness on downscales.',
      examples: [
        { title: '4K → 1080p web version', body: 'A 280 MB 4K screen recording becomes a 78 MB 1080p clip — looks identical on most displays at a fraction of the size.' },
        { title: 'Multiple sizes for ABR', body: 'Generate 1080p, 720p, and 480p renditions from one source for adaptive bitrate streaming on your own site.' },
        { title: '50% downscale', body: 'A 1920×1080 input scales to 960×540 (quarter the pixels) in one click — quick for previews and thumbnails.' },
      ],
      useCases: [
        'Reducing 4K footage for web playback',
        'Producing multiple resolutions for adaptive streaming',
        'Shrinking video to fit upload limits',
        'Generating previews / thumbnails from full-resolution sources',
        'Standardising mixed-resolution footage to one target size',
      ],
      troubleshooting: [
        { problem: 'Output looks soft', solution: 'Switch the scaler from "bilinear" to "Lanczos" or "bicubic" for sharper downscales. Bilinear is fast but blurs detail.' },
        { problem: 'Aspect ratio looks squashed', solution: 'Enable "preserve aspect ratio" — otherwise entering both width and height stretches the video. Set only one, and let the other compute.' },
        { problem: 'File size barely changed', solution: 'Resizing alone doesn\'t guarantee smaller files if bitrate stays high. Combine with re-encoding (CRF 23-28) for big savings.' },
      ],
    },
  },
  'merge-videos': {
    exampleOutput: {
      input: '4 MP4 clips (1080p H.264, 30 fps each — 2m total)',
      output: 'merged.mp4 — 2m, 1080p, seamless concatenation',
      description: 'Lossless stream-copy concatenation when all sources share codec/resolution/fps. Otherwise transcodes to a common format with no perceptible quality loss.',
    },
    seo: {
      intro: 'Concatenate multiple video clips into a single file with drag-and-drop ordering. When all sources match codec, resolution, and frame rate, merging is instant and lossless (stream-copy). When they differ, the tool transcodes to a common format automatically — no manual conversion required.',
      examples: [
        { title: 'Compilation reel', body: 'Four short product highlights merge into one continuous 2-minute demo for a sales page.' },
        { title: 'Multi-camera edit', body: 'Stitch sequential clips from a single shoot into one continuous take.' },
        { title: 'Wedding montage', body: 'Twenty short clips from a guest\'s phone merge in chronological order into one shareable video.' },
      ],
      useCases: [
        'Building demo reels from short clips',
        'Compiling tutorial segments into one lesson',
        'Stitching split phone recordings back together',
        'Creating wedding / event montages',
        'Producing single-file deliverables for clients',
      ],
      troubleshooting: [
        { problem: 'Audio drifts out of sync between clips', solution: 'Sources have different sample rates. Enable "normalise audio" — the tool will resample all to 48 kHz before merging.' },
        { problem: 'Visible jump at clip boundaries', solution: 'Sources have different resolutions/fps so a transcode pass was needed; use the cross-fade option (0.5s default) to smooth boundaries.' },
        { problem: 'Merge fails with "incompatible codecs"', solution: 'Switch to "force transcode" mode. Stream-copy only works when every source shares the same codec; transcode converts everything to a common H.264/AAC base.' },
      ],
    },
  },
  'rotate-video': {
    exampleOutput: {
      input: 'phone-clip.mp4 (1080×1920, recorded sideways)',
      output: 'phone-clip-rotated.mp4 (1920×1080, rotated 90° clockwise)',
      description: 'Rotates by 90° / 180° / 270° or any custom angle. 90/180/270 are lossless (metadata flag); arbitrary angles re-encode the frames.',
    },
    seo: {
      intro: 'Fix sideways or upside-down phone clips by rotating them by 90°, 180°, 270°, or any custom angle. The 90° presets are lossless — only the orientation metadata changes, with no re-encoding. Arbitrary angles render the rotated frames at full quality.',
      examples: [
        { title: 'Fix portrait → landscape', body: 'A clip accidentally recorded in portrait rotates 90° clockwise into a proper 1920×1080 landscape video in seconds.' },
        { title: 'Upside-down GoPro', body: 'A 180° flip corrects footage from a GoPro mounted upside-down.' },
        { title: 'Slight tilt correction', body: 'Enter 2.5° to straighten a slightly tilted clip — the tool re-renders frames and crops to remove the resulting empty corners.' },
      ],
      useCases: [
        'Correcting sideways phone clips',
        'Fixing flipped action-camera footage',
        'Straightening tilted handheld shots',
        'Standardising mixed-orientation footage before merging',
        'Repurposing landscape footage as vertical (90° + crop)',
      ],
      troubleshooting: [
        { problem: 'Player still shows the video sideways', solution: 'Some players ignore the rotation metadata flag. Pick "apply rotation by re-encoding" so the rotation is baked into the pixels and shows correctly everywhere.' },
        { problem: 'Black bars after custom-angle rotation', solution: 'Rotating an image by a non-90° angle leaves triangular gaps. Enable "auto-crop to fit" to remove them (slight zoom-in is unavoidable).' },
        { problem: 'Aspect ratio looks wrong after 90° rotate', solution: 'That\'s correct — 1920×1080 becomes 1080×1920. If you want to keep the original aspect, use the resize tool afterwards.' },
      ],
    },
  },
  'change-video-speed': {
    exampleOutput: {
      input: 'tutorial.mp4 (12m, 1× speed)',
      output: 'tutorial-1.5x.mp4 (8m, 1.5× speed, pitch-corrected audio)',
      description: 'Speed range 0.25× to 4×. Audio is time-stretched with pitch correction so 1.5× speech still sounds natural, not chipmunk-y.',
    },
    seo: {
      intro: 'Speed up or slow down a video while keeping audio natural — the tool time-stretches audio with pitch correction so 1.5× tutorial speech sounds like a normal-pitch fast talker, not a chipmunk. Speed range 0.25× (4× slow-motion) to 4× (4× fast-forward).',
      examples: [
        { title: 'Tutorial fast-forward', body: 'A 12-minute tutorial at 1.5× is 8 minutes; viewers still understand every word because pitch is preserved.' },
        { title: 'Slow-motion analysis', body: 'A 60 fps sports clip at 0.25× becomes a smooth 240-fps-feel slow-motion replay for technique review.' },
        { title: 'Mute + 2× speedrun', body: 'For a silent demo-reel intro, set 2× speed with audio muted for a sped-up "fast-cut" feel.' },
      ],
      useCases: [
        'Fast-forwarding tutorials and lectures',
        'Slow-motion analysis (sports, dance, science)',
        'Creating "speed-up" social-media intros',
        'Time-lapse-style condensations of long content',
        'Trimming runtime to fit broadcast slots',
      ],
      troubleshooting: [
        { problem: 'Audio sounds chipmunk-y at high speed', solution: 'Pitch correction is off — enable "preserve pitch" so 1.5× speech retains normal voice pitch.' },
        { problem: 'Slow-motion looks choppy', solution: 'Source is 30 fps. For smooth slow-motion you need a high-fps source (60 / 120 / 240 fps), or enable "frame interpolation" to synthesise intermediate frames.' },
        { problem: 'A/V drift accumulates over a long clip', solution: 'Re-encode container as MP4 with AAC audio. MKV or older codecs can drift on extreme speed changes.' },
      ],
    },
  },
  'extract-audio': {
    exampleOutput: {
      input: 'concert.mp4 (45 min, 1080p, 192 kbps audio)',
      output: 'concert.mp3 (45 min, 192 kbps, ~62 MB) — or .wav / .aac / .ogg',
      description: 'Demuxes and (optionally) re-encodes the audio track. Stream-copy when output format matches source codec — instant, lossless.',
    },
    seo: {
      intro: 'Pull the audio track out of any video file into MP3, WAV, AAC, OGG, or FLAC. When the output format matches the source codec, the extraction is a lossless stream-copy (instant); otherwise the tool re-encodes at a bitrate you choose. Useful for podcasts, transcription prep, or simply listening on the go.',
      examples: [
        { title: 'Podcast from a Zoom recording', body: 'Pull AAC audio out of a meeting MP4 as a lossless M4A — no re-encoding, identical quality, smaller file.' },
        { title: 'Music WAV for editing', body: 'Extract uncompressed WAV from a concert MP4 for editing in Audacity / Logic Pro.' },
        { title: 'Transcription source', body: 'Strip audio to FLAC and feed it to Whisper for the smallest input file that\'s still lossless.' },
      ],
      useCases: [
        'Converting video lectures into audio podcasts',
        'Preparing source audio for transcription',
        'Extracting music for editing or sampling (own content)',
        'Reducing storage when only audio matters',
        'Creating audio-only versions for low-bandwidth listeners',
      ],
      troubleshooting: [
        { problem: 'Output bitrate is lower than the source', solution: 'Pick "match source bitrate" instead of fixed 128 kbps. The default cap of 128 is conservative — bump to 192-320 for music.' },
        { problem: 'Multiple audio tracks — got the wrong one', solution: 'Pick the audio-track index in advanced options. Default is track 0; track 1 is usually the second language / commentary.' },
        { problem: 'Output file too large', solution: 'Switch from WAV/FLAC (lossless, huge) to MP3 / AAC (lossy, 10× smaller). 128 kbps MP3 is fine for spoken word.' },
      ],
    },
  },
  'mute-video': {
    exampleOutput: {
      input: 'screen-recording.mp4 (5m, 1080p with system audio)',
      output: 'screen-recording-muted.mp4 (5m, 1080p, audio track removed)',
      description: 'Strips the audio track entirely — no silent track, just video. Lossless: the video stream is stream-copied unchanged.',
    },
    seo: {
      intro: 'Remove the audio track from any video — completely strip it, not just silence it. The video stream is stream-copied unchanged (lossless, instant), only the audio track is dropped. Output file is smaller and has no audio at all.',
      examples: [
        { title: 'Silent screen recording', body: 'Strip the keyboard-clack audio from a 5-minute screen recording for a clean tutorial that someone else will narrate.' },
        { title: 'Background-music replacement prep', body: 'Mute the original soundtrack of a clip before adding your own music in an editor.' },
        { title: 'Privacy redaction', body: 'Mute a video to remove an embarrassing background conversation before sharing it.' },
      ],
      useCases: [
        'Cleaning up screen recordings before voice-over',
        'Removing background noise from family videos',
        'Stripping copyrighted music before re-uploading',
        'Preparing video for replacement audio track',
        'Quick privacy fix for accidentally-captured speech',
      ],
      troubleshooting: [
        { problem: 'Output still plays sound', solution: 'A second audio track may still be present. Toggle "remove ALL audio tracks" instead of "remove primary track only".' },
        { problem: 'File size barely smaller after muting', solution: 'Most of a video\'s size is the video stream — audio is usually 5-10% of total. The savings are small unless the source had a high-bitrate audio track.' },
        { problem: 'Some players show "no audio device" warning', solution: 'Toggle "add silent audio track" — a few players require an audio track to exist (even if silent) for normal playback.' },
      ],
    },
  },
  'video-to-images': {
    exampleOutput: {
      input: 'short-clip.mp4 (5s @ 30 fps)',
      output: 'frames.zip — 150 JPG frames at 1920×1080 (frame-001.jpg…frame-150.jpg)',
      description: 'Extracts every frame, every Nth frame, or one frame per second. Output format JPG / PNG / WebP; quality slider for JPG.',
    },
    seo: {
      intro: 'Extract video frames as individual still images — every frame, every Nth frame, or one frame per second. Output in JPG (small) / PNG (lossless) / WebP (modern). Useful for thumbnails, animation studies, machine-learning datasets, or grabbing a perfect freeze-frame from action footage.',
      examples: [
        { title: 'Build a sprite sheet', body: 'Extract every 3rd frame of a 10-second animation to assemble a sprite sheet for a game UI.' },
        { title: 'ML training dataset', body: 'One frame per second from an hour of dashcam footage = 3,600 labelled images for an object-detection model.' },
        { title: 'Hero frame search', body: 'Extract all frames of a 3-second clip, browse them as thumbnails, and pick the perfect one for a thumbnail.' },
      ],
      useCases: [
        'Building ML training datasets from video',
        'Finding the perfect thumbnail / cover frame',
        'Creating sprite sheets for animation / games',
        'Frame-by-frame motion analysis (sports, science)',
        'Generating storyboard contact sheets',
      ],
      troubleshooting: [
        { problem: 'Got 30,000 files from a short clip', solution: '"Every frame" at 30 fps × 1 min = 1,800 frames. Use "every Nth frame" or "1 per second" instead unless you truly need every frame.' },
        { problem: 'Frames look soft', solution: 'Bump JPG quality to 95+, or switch to PNG / WebP-lossless. JPG at 75 is a default trade-off — fine for previews, not archival.' },
        { problem: 'Extracted frames have weird timing', solution: 'Use "key-frames only" if frames need to match scene cuts exactly. Otherwise extraction is uniform by timestamp.' },
      ],
    },
  },
  'reverse-video': {
    exampleOutput: {
      input: 'jump.mp4 (4s — person jumping up)',
      output: 'jump-reversed.mp4 (4s — person landing back upward, audio also reversed)',
      description: 'Frame-by-frame reversal. Audio is reversed too (toggle to mute audio if reversed speech sounds disturbing).',
    },
    seo: {
      intro: 'Play a video backwards — for boomerang loops, magic-trick effects, "unbreaking" clips, or simply a fun reverse edit. Every frame is reversed in order, and audio is reversed too (with an option to mute it instead, since reversed speech can sound creepy).',
      examples: [
        { title: 'Boomerang loop', body: 'Concatenate the original clip + reversed clip → a seamless ping-pong loop, perfect for Instagram Boomerang-style posts.' },
        { title: 'Unbreaking effect', body: 'A clip of someone breaking a vase, reversed, becomes "vase reassembling itself" — classic visual gag.' },
        { title: 'Splash physics', body: 'Reverse a splash to make liquid leap back into a glass — viral-content fodder.' },
      ],
      useCases: [
        'Boomerang / ping-pong loops for social media',
        'Magic-trick / "unbreaking" visual gags',
        'Reverse-motion sports analysis',
        'Creative video edits and transitions',
        'Reversing time-lapses (e.g. flower closing back up)',
      ],
      troubleshooting: [
        { problem: 'Reversed clip is huge', solution: 'Reversal requires storing every frame in memory. Trim to a shorter segment (under 30s) before reversing, then merge with the original.' },
        { problem: 'Audio sounds disturbing', solution: 'Toggle "mute reversed audio" — reversed speech and laughter often sound unsettling. Add new audio in an editor after.' },
        { problem: 'Output stutters', solution: 'Variable-frame-rate (VFR) source. Pre-convert to constant frame rate (CFR) with the resize/re-encode tool first, then reverse.' },
      ],
    },
  },
  'loop-video': {
    exampleOutput: {
      input: 'fireplace-loop.mp4 (30s clip designed to loop)',
      output: 'fireplace-loop-1h.mp4 (60 min — 120 repeats of the source)',
      description: 'Specify number of loops OR total target duration; the tool concatenates the source as many times as needed.',
    },
    seo: {
      intro: 'Loop a short video to a target duration or number of repeats — useful for ambient background videos (fireplaces, aquariums, rain), seamless GIFs, signage displays, or filling time in livestream pre-rolls. Looping is stream-copy concatenation: instant, lossless, no re-encoding.',
      examples: [
        { title: '1-hour fireplace background', body: 'A perfect 30-second fireplace loop becomes a 1-hour ambient video for streaming on a TV.' },
        { title: 'Signage loop', body: 'A 10-second promo clip loops to 5 minutes for a retail display monitor running unattended.' },
        { title: 'Boomerang × N', body: 'Combine with the reverse tool: original + reversed, then loop 10× for a long ping-pong background.' },
      ],
      useCases: [
        'Ambient background videos (fire, water, rain)',
        'Retail / event signage that needs to fill time',
        'Livestream pre-roll waiting screens',
        'Long-form versions of short artistic loops',
        'Yoga / meditation timer videos',
      ],
      troubleshooting: [
        { problem: 'Visible jump at the loop point', solution: 'Source isn\'t a perfect loop — its last frame doesn\'t match its first. Trim a few frames at the end and try again, or cross-fade between loops.' },
        { problem: 'Output is enormous', solution: 'Loops don\'t actually duplicate the video stream in some containers (MP4 supports edit lists); but most players need a concatenated file. Compress source before looping.' },
        { problem: 'Audio click between loops', solution: 'Audio waveform doesn\'t end at zero crossing. Toggle "audio fade across joins" (default 50ms) to mask the discontinuity.' },
      ],
    },
  },
  'video-thumbnail': {
    exampleOutput: {
      input: 'tutorial.mp4 (12 min, 1080p)',
      output: 'thumbnail.jpg — 1920×1080 at the chosen timestamp (e.g. 00:02:30)',
      description: 'Single-frame still at a chosen time, or auto-pick the most visually interesting frame. Output JPG / PNG / WebP at full source resolution.',
    },
    seo: {
      intro: 'Generate a cover image / thumbnail from any video. Pick an exact timestamp on the timeline, or let the tool auto-select the frame with the most visual variance (avoiding black frames and blurry transitions). Output at full source resolution — no upscaling artefacts.',
      examples: [
        { title: 'YouTube thumbnail draft', body: 'Pick a strong frame at 2:30 of a tutorial, export at 1920×1080, then add text in any image editor.' },
        { title: 'Auto-cover for a video gallery', body: 'Batch-generate auto-picked thumbnails for 50 videos so a gallery page has visually distinct previews.' },
        { title: 'Hero shot for a portfolio', body: 'Choose the perfect freeze-frame from a 30-second showreel for a portfolio website header.' },
      ],
      useCases: [
        'YouTube / Vimeo thumbnail creation',
        'Cover images for video CMS galleries',
        'Hero shots for portfolio sites',
        'Preview frames in chat / social link unfurls',
        'Quick stills for press kits or blog posts',
      ],
      troubleshooting: [
        { problem: 'Auto-pick selected a blurry frame', solution: 'Switch from "variance" to "sharpness" auto-pick mode, or just scrub the timeline to pick manually.' },
        { problem: 'Thumbnail is darker than the video looks', solution: 'Source has metadata-level brightness adjustments. Toggle "apply video filters before snapshot" so the frame matches what the player shows.' },
        { problem: 'Output is too low-resolution', solution: 'Thumbnail matches source resolution. For higher-res, upscale the source first (or use an image-upscaler tool on the thumbnail).' },
      ],
    },
  },
  'split-video': {
    exampleOutput: {
      input: 'webinar.mp4 (1h30m, 1080p)',
      output: '9 MP4 files — each ~10 min, named webinar-part-01.mp4 … part-09.mp4',
      description: 'Split modes: every N minutes/seconds, by file size, at exact timestamps, or by N equal segments. Stream-copy when possible (instant).',
    },
    seo: {
      intro: 'Split a long video into smaller files — by time interval, by target file size, at exact timestamps, or into N equal segments. Stream-copy when the split lands on a keyframe (instant, lossless); otherwise frame-accurate re-encoding at the boundary.',
      examples: [
        { title: 'Upload-limit split', body: 'A 4 GB webinar splits into 4 × 1 GB chunks that fit any upload limit, then merge again on the other end.' },
        { title: 'Course-module split', body: 'A 90-minute course splits at exact chapter timestamps (00:15:00, 00:35:00, 01:05:00) into module files.' },
        { title: 'Equal segments for distribution', body: 'A 60-min interview splits into 6 × 10-min parts for distribution on a platform that caps individual videos at 10 minutes.' },
      ],
      useCases: [
        'Splitting long videos to fit upload limits',
        'Breaking a course / webinar into modules',
        'Producing short segments for social media',
        'Distributing parts for parallel transcription',
        'Reducing per-file size for email sharing',
      ],
      troubleshooting: [
        { problem: 'Each split file is slightly different in size despite "equal segments"', solution: 'Splits snap to keyframes. Enable "frame-accurate" mode for exact equal segments (re-encodes boundaries).' },
        { problem: 'Audio glitch at split boundaries', solution: 'Audio frames don\'t align with video keyframes. Frame-accurate mode re-encodes the boundary to fix the glitch — slower, but clean.' },
        { problem: 'Output files don\'t open in some players', solution: 'Switch container to MP4 with H.264. Stream-copy preserves whatever codec the source used; some players are picky.' },
      ],
    },
  },
  'add-text-to-video': {
    exampleOutput: {
      input: 'product-demo.mp4 (15s, 1080p)',
      output: 'product-demo-titled.mp4 — same clip with "New in 2026" overlay text bottom-centre',
      description: 'Add text overlays at chosen position, font, size, colour, and on-screen duration. Multiple overlays with different timings supported.',
    },
    seo: {
      intro: 'Overlay text on a video — titles, captions, call-outs, watermarks. Pick the position, font, size, colour, background, and on-screen time range for each overlay. Multiple overlays with independent timings let you build simple subtitle tracks or call-out sequences without a full editor.',
      examples: [
        { title: 'Title card', body: 'Add "New in 2026" as a 3-second title at the start of a product demo, large centred white text on a dark band.' },
        { title: 'Caption track', body: 'Add 30 timed text overlays as a basic subtitle track for accessibility — no need to upload to YouTube\'s caption editor.' },
        { title: 'Call-out arrows', body: 'Combine text + emoji arrow (e.g. "👉 Click here") synced to specific moments in a tutorial.' },
      ],
      useCases: [
        'Adding title cards and end cards',
        'Building accessibility subtitles for short videos',
        'Tutorial call-outs and pointers',
        'Branding videos with channel names / URLs',
        'Adding context (date, location, attribution)',
      ],
      troubleshooting: [
        { problem: 'Text is hard to read against busy backgrounds', solution: 'Add a semi-transparent background bar behind the text (toggle in style options). Or use a thick text stroke / drop shadow.' },
        { problem: 'Custom font isn\'t rendering', solution: 'Embed the font file in the tool\'s font picker, or pick one of the bundled fonts. Browser font cache doesn\'t reach the WASM encoder.' },
        { problem: 'Vietnamese / CJK characters show as boxes', solution: 'Pick a font that includes the required glyphs (e.g. Noto Sans / Noto Sans CJK). The default font may be Latin-only.' },
      ],
    },
  },
  'add-watermark-to-video': {
    exampleOutput: {
      input: 'portfolio-clip.mp4 + logo.png',
      output: 'portfolio-clip-watermarked.mp4 — logo overlaid in top-right at 30% opacity',
      description: 'Image (PNG with transparency) or text watermark, with position, opacity, size, and on-screen duration controls.',
    },
    seo: {
      intro: 'Add a logo or text watermark to a video — protect ownership, brand uploads, or add a "Sample / Preview" stamp before sharing draft footage. Choose position, opacity, size, and on-screen duration; transparent PNG watermarks composite cleanly over any background.',
      examples: [
        { title: 'Brand logo overlay', body: 'A small logo at 30% opacity in the top-right corner, visible for the full duration of every clip in a YouTube series.' },
        { title: '"DRAFT" stamp', body: 'A bold semi-transparent "DRAFT - DO NOT SHARE" text watermark across the centre of a preview clip sent to a client.' },
        { title: 'Periodic flash', body: 'Watermark visible only for 1 second every 30 seconds — less distracting but still impossible to remove cleanly via cropping.' },
      ],
      useCases: [
        'Protecting portfolio / showreel clips from theft',
        'Branding YouTube / social uploads with channel logo',
        '"Preview" stamps on client-review videos',
        'Trade-show display videos with sponsor logos',
        'Educational content attribution',
      ],
      troubleshooting: [
        { problem: 'Logo background looks white instead of transparent', solution: 'Upload a real PNG with alpha channel — a JPG flattens transparency to white. Re-export the logo from your design tool with transparent background.' },
        { problem: 'Watermark too big / too small', solution: 'Watermark size is in % of video width — try 10-15% for a subtle logo, 40-60% for a "DRAFT" stamp.' },
        { problem: 'Edge of logo looks pixelated', solution: 'Upload a higher-resolution logo. The watermark is scaled to fit, so a tiny source PNG will look blurry on 1080p video.' },
      ],
    },
  },
  'convert-video': {
    exampleOutput: {
      input: 'movie.mkv (1080p H.265, 2 audio tracks)',
      output: 'movie.mp4 (1080p H.264, primary audio, AAC) — universally playable',
      description: 'Convert between MP4 / MKV / MOV / WebM / AVI containers and re-encode video/audio codecs as needed. Stream-copy when codec/container are already compatible.',
    },
    seo: {
      intro: 'Convert videos between the major containers — MP4, MKV, MOV, WebM, AVI — and re-encode video and audio codecs if needed. When the source codec is already compatible with the target container, the tool stream-copies (instant, lossless). Otherwise it transcodes with sensible defaults.',
      examples: [
        { title: 'MKV → MP4 for compatibility', body: 'An MKV file plays on Linux but not on an iPad. Convert to MP4 (H.264 + AAC) and it plays everywhere.' },
        { title: 'MOV → WebM for the web', body: 'A QuickTime MOV becomes a WebM optimised for HTML5 `<video>` autoplay in modern browsers.' },
        { title: 'AVI → MP4 for archiving', body: 'A legacy AVI with DivX video converts to a modern MP4 with H.264 — smaller, more compatible, easier to play.' },
      ],
      useCases: [
        'Cross-device compatibility (Mac ↔ Windows ↔ iOS ↔ Android)',
        'Preparing video for HTML5 web playback',
        'Modernising legacy AVI / WMV files',
        'Replacing proprietary container with open one (or vice versa)',
        'Standardising mixed-format folders to one format',
      ],
      troubleshooting: [
        { problem: 'Output won\'t play on iOS', solution: 'iOS requires H.264 video + AAC audio in MP4. Pick those explicitly instead of "copy codec" — the source codec may be unsupported.' },
        { problem: 'Multi-channel audio collapsed to stereo', solution: 'Toggle "preserve all audio channels" — default is to downmix surround to stereo for compatibility.' },
        { problem: 'Subtitles missing after conversion', solution: 'Subtitles are a separate stream. Toggle "include subtitle streams" to copy them. MP4 supports mov_text; for SRT, keep MKV.' },
      ],
    },
  },
  'video-frame-extractor': {
    exampleOutput: {
      input: 'action-clip.mp4 (10s @ 60 fps = 600 frames)',
      output: 'frames.zip — pick by frame index (e.g. frames 120, 240, 360) as PNG/JPG',
      description: 'Frame-accurate extraction by index or timestamp. PNG for lossless, JPG / WebP for smaller files. One specific frame or a list.',
    },
    seo: {
      intro: 'Extract specific frames from a video with frame-perfect accuracy — by frame index (e.g. frame 120 of 600) or exact timestamp (e.g. 00:01:23.500). Output as PNG for lossless captures or JPG / WebP for smaller files. Different from "video to images" — this is for picking a few precise frames, not bulk extraction.',
      examples: [
        { title: 'Bug-report screenshot', body: 'Grab the exact frame where a UI glitch appears (frame 412 of a 600-frame recording) as a lossless PNG for the issue tracker.' },
        { title: 'Sports key frame', body: 'Extract the exact moment a ball touches the line from a 240-fps phone clip for definitive analysis.' },
        { title: 'Animation reference', body: 'Pull frames 1, 5, 10, 15, 20 of a walk-cycle for use as keyframe references in a 3D animation tool.' },
      ],
      useCases: [
        'Bug-report screenshots from screen recordings',
        'Sports / motion analysis at key moments',
        'Animation key-frame references',
        'Scientific frame capture (microscopy, high-speed footage)',
        'Forensic / evidentiary frame extraction',
      ],
      troubleshooting: [
        { problem: 'Frame index seems off', solution: 'Source has variable frame rate; frame N at 30 fps ≠ N at the actual VFR timing. Switch to timestamp mode for precise control.' },
        { problem: 'Extracted frame is dark / motion-blurred', solution: 'That\'s the actual frame content. Try ±1-2 frames for a sharper neighbour. Cinema / consumer-camera footage often has motion blur per frame.' },
        { problem: 'PNG file is huge', solution: 'Lossless PNG at 4K can be 5-10 MB per frame. Switch to JPG quality 95 for ~10% the size with no visible loss.' },
      ],
    },
  },
  'video-screenshot': {
    exampleOutput: {
      input: 'gameplay.mp4 (1080p) at 00:03:42',
      output: 'gameplay-screenshot.png (1920×1080, lossless PNG)',
      description: 'One-click freeze-frame at the current player position. PNG (lossless) or JPG (smaller). Copies to clipboard option too.',
    },
    seo: {
      intro: 'Take a clean screenshot of any video frame at full source resolution — no player UI, no compression artefacts, no manual cropping. Useful for capturing memorable moments, sharing exact frames in chat, or grabbing references for blog posts and reviews. PNG (lossless) by default; JPG / WebP available for smaller files.',
      examples: [
        { title: 'Game-moment share', body: 'Capture the exact victory screen frame from a gameplay recording — full 1080p PNG, ready to share to friends or a fan forum.' },
        { title: 'Movie-quote meme', body: 'Snap the perfect dialog moment from a film clip (own content) for a quote-card meme.' },
        { title: 'Reference image', body: 'Grab a cinematography reference frame for a blog post on lighting techniques.' },
      ],
      useCases: [
        'Capturing memorable gaming / sports moments',
        'Reference frames for blog posts and reviews',
        'Sharing exact frames in chat / email',
        'Building meme / reaction images from clips',
        'Documentation screenshots from video tutorials',
      ],
      troubleshooting: [
        { problem: 'Screenshot is darker than the playing video', solution: 'Player applied HDR-to-SDR conversion that the snapshot didn\'t. Enable "match player rendering" so the snapshot matches what you see in the player.' },
        { problem: 'Got a blurry / motion-blur frame', solution: 'Nudge the timeline ±1 frame for the cleanest neighbouring frame. Use the dedicated frame-extractor tool for finer control.' },
        { problem: 'Screenshot file is huge as PNG', solution: 'Switch to JPG quality 95 — same apparent quality, ~10% the size. PNG is only essential for screenshots with sharp UI / text edges.' },
      ],
    },
  },
};

let updated = 0, skipped = 0;

for (const [id, data] of Object.entries(DATA)) {
  const idRegex = new RegExp(`id: '${id}',`);
  const idMatch = src.match(idRegex);
  if (!idMatch) { console.warn('NOT FOUND:', id); skipped++; continue; }
  const idIdx = idMatch.index;
  let openIdx = src.lastIndexOf('  {\r\n', idIdx);
  if (openIdx < 0) openIdx = src.lastIndexOf('  {\n', idIdx);
  if (openIdx < 0) { console.warn('NO OPEN:', id); skipped++; continue; }
  let depth = 0, closeIdx = -1;
  for (let i = openIdx + 1; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') { depth--; if (depth === 0) { closeIdx = i; break; } }
  }
  if (closeIdx < 0) { console.warn('NO CLOSE:', id); skipped++; continue; }
  const block = src.slice(openIdx, closeIdx + 1);
  if (/seoContent\s*:/.test(block)) { skipped++; continue; }
  const howToMatch = block.match(/howToUse:\s*\[[\s\S]*?\],\r?\n/);
  if (!howToMatch) { console.warn('NO howToUse:', id); skipped++; continue; }
  const insertAt = openIdx + howToMatch.index + howToMatch[0].length;

  const ex = data.exampleOutput, seo = data.seo;
  const exampleStr =
`    exampleOutput: {
      input: ${JSON.stringify(ex.input)},
      output: ${JSON.stringify(ex.output)},
      description: ${JSON.stringify(ex.description)},
    },
    seoContent: {
      intro: ${JSON.stringify(seo.intro)},
      examples: [
${seo.examples.map(e => `        { title: ${JSON.stringify(e.title)}, body: ${JSON.stringify(e.body)} },`).join('\r\n')}
      ],
      useCases: [
${seo.useCases.map(u => `        ${JSON.stringify(u)},`).join('\r\n')}
      ],
      troubleshooting: [
${seo.troubleshooting.map(t => `        { problem: ${JSON.stringify(t.problem)}, solution: ${JSON.stringify(t.solution)} },`).join('\r\n')}
      ],
    },
`;
  const crlfStr = exampleStr.replace(/\r?\n/g, '\r\n');
  src = src.slice(0, insertAt) + crlfStr + src.slice(insertAt);
  updated++;
}

fs.writeFileSync(FILE, src);
console.log(`Updated: ${updated}, Skipped: ${skipped}`);
