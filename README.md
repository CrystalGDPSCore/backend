# Crystal (Backend)
Just a simple GDPS core written on TypeScript, Fastify & Prisma ORM.

## How to install
- Download ``ffmpeg`` from [gyan.dev](https://www.gyan.dev/ffmpeg/builds/#release-builds) (
``ffmpeg-release-full-shared.7z``), drop it into the Crystal root folder and rename it to ``ffmpeg``.
- Rename ``.env.example`` to ``.env``, add all the variables you need to the ``.env`` file (``DATABASE_URL`` and ``REDIS_URL`` are required).
- Edit the ``config.json`` file.
- For the first time, write ``npx prisma db push`` and ``npx prisma db pull`` in the terminal.
- Start **Crystal** on the hosting.
- Change Robtop's server to your server (don't forget to change base64).
- To make music library work, change ``https://www.newgrounds.com/audio/download/%i`` to your link (your server + ``mp3/%i`` at the end).

The core isn't completely finished yet, but it's safe to use if you want to.
If you want to report a bug or just want to chat, join the [Crystal's support server](https://discord.com/invite/FCKAkR9XPb).