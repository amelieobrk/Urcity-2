import { Unity, useUnityContext } from "react-unity-webgl";
import Head from 'next/head';
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react';
import React from 'react';
import { Dialog } from '@headlessui/react'
import { useRouter } from 'next/router'
import { useSession } from "next-auth/react";
export default function Editor() {
  const { unityProvider, takeScreenshot, addEventListener, removeEventListener, UNSAFE__detachAndUnloadImmediate: detachAndUnloadImmediate, isLoaded, loadingProgression, requestFullscreen } = useUnityContext({
    loaderUrl: "/build/build.loader.js",
    dataUrl: "/build/build.data.gz",
    frameworkUrl: "/build/build.framework.js.gz",
    codeUrl: "/build/build.wasm.gz",
    webglContextAttributes: {
      preserveDrawingBuffer: true,
    },
  });

  const handleScreenshot = useCallback((screenshotFromUnity) => {
    // Exit fullscreen before opening dialog
    if (document.fullscreenElement) {
      requestFullscreen(false)
    }

    // We are not using the screenshot from inside Unity right now.
    //console.log("got Screenshot", screenshotFromUnity);

    // Instead we are taking a screenshot from outside Unity.
    const dataUrl = takeScreenshot("image/jpeg", 0.5);
    //console.log("dataurl: ", dataUrl);
    setImageUrl(dataUrl)
    setDialogOpen(true)
  }, [takeScreenshot, requestFullscreen]);

  const handleFullscreen = useCallback(() => {
    requestFullscreen(!document.fullscreenElement)
  }, [requestFullscreen]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const {data: session } = useSession();
  /* 1. Beim Öffnen der Page, return beim schließen der Page*/
  useEffect(() => {
    addEventListener("Screenshot", handleScreenshot)
    addEventListener("Fullscreen", handleFullscreen)
    return () => {
      removeEventListener("Screenshot", handleScreenshot)
      removeEventListener("Fullscreen", handleFullscreen)
      detachAndUnloadImmediate()
    }
  }, [addEventListener, removeEventListener, detachAndUnloadImmediate, handleScreenshot, handleFullscreen])

  async function submit(titel, beschreibung) {
    setSubmitted(true)
    const response = await fetch('/api/scenes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: titel,
        description: beschreibung,
        screenshots: [imageUrl]
      }),
    })
    if (response.ok) {
      const result = await response.json()
      router.push(`/scene/${result._id}`)
    }
  }

  return (
    <div>
      { !session &&( 
        <div>
        <Head>
        <title> Editor</title>
        </Head>
        <div>
        <h1 style={{ textAlign: 'center', marginTop:'2rem'}}> No Permission! </h1>
        <p style={{ textAlign: 'center', marginTop:'2rem'}}> Bitte Loggen Sie sich ein, um den Editor benutzen zu können!</p>
        </div>
        </div>

      )}
      { session && (
      <div>
      <Head>
        <title>
          Editor
        </title>
      </Head>
      <div>
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          {/* Full-screen container to center the panel */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            {/* The actual dialog panel  */}
            <Dialog.Panel className="mx-auto grow max-w-md rounded shadow bg-white dark:bg-gray-700">
              <Dialog.Title className="create-h2">Titel und Beschreibung hinzufügen!</Dialog.Title>
              <div className="create">
                <label>
                  Titel
                </label>
                <textarea
                  id="title"
                  maxLength="60"
                  value={title}
                  placeholder="Titel eingeben!"
                  rows="1"
                  className="block mb-6 p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={(e) => setTitle(e.target.value)} />
                <label>
                  Beschreibung
                </label>
                <textarea
                  className="block mb-6 p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={description}
                  maxLength="150"
                  id="description "
                  placeholder="Beschreibung eingeben"
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                >
                </textarea>
                <button type="button" disabled={!title.length || submitted} className="text-white bg-slate-500 disabled:bg-slate-200 enabled:hover:bg-slate-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none"
                  onClick={() => submit(title, description)}  >
                  Teilen
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
      <div className="unity-game">
        {isLoaded === false && (
          // We'll conditionally render the loading overlay if the Unity
          // Application is not loaded.
          <div className="loading-overlay">
            <p>Unity Game Loading... ({Math.round(loadingProgression * 100)}%)</p>
          </div>
        )}
        <Unity unityProvider={unityProvider} tabIndex="0" className="mx-auto aspect-video outline-none" style={{width:'70%', margin:'2rem'}} />
      </div>

      { /* ----- Don't remove this. This prevents the "unload" bug. Seems like a race condition, not sure of this "Link" element fixes it, but it works.
                 Here is upstream report with another possible fix: https://github.com/jeffreylanters/react-unity-webgl/discussions/434 */ }
      <div><Link href="/.."></Link></div>
      { /* ----- */}

    </div>
    )}
    </div>
  );
}
