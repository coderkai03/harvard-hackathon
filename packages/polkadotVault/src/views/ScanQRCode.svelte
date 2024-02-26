<script lang="ts">
  import { onMount } from 'svelte';
  import jsQR from 'jsqr';
  import { imageSquareIcon } from '../icon/index.js';

  type optionsType = {
    // eslint-disable-next-line @typescript-eslint/ban-types
    onPermissionError?: Function;
    // eslint-disable-next-line @typescript-eslint/ban-types
    onResulted?: Function;
  };

  export let scanResult = '';
  export let isBack: boolean;
  export let enableQRCodeReaderButton: boolean;
  export let options: optionsType;

  export let onBack : () => void;

  let canScan = false;
  let video: any;
  let canvas: any;

  onMount(() => {
    requestCamera();
  });

  function requestCamera() {
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          facingMode: 'environment',
        },
      })
      .then((userStream) => {
        video.srcObject = userStream;
        video.setAttribute('playsinline', true);
        video.play();
        startScan();
      })
      .catch((err) => {
        canScan = false;
        if (options?.onPermissionError != undefined) {
          options.onPermissionError();
        } else {
          alert(err);
        }
      });
  }

  function startScan() {
    if( !canvas ) return;
    const context = canvas?.getContext('2d', { willReadFrequently: true });
    const { width, height } = canvas;

    context?.drawImage(video, 0, 0, width, height);

    const imageData = context?.getImageData(0, 0, width, height);
    const qrCode = jsQR(imageData.data, width, height);

    if (qrCode) {
      scanResult = qrCode.data;
      if (options?.onResulted != undefined) {
        options.onResulted(qrCode.data);
      } else {
        alert(qrCode.data);
        setTimeout(startScan, 1000);
      }
    } else {
      setTimeout(startScan, 500);
    }
  }

  function onCanPlay() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canScan = true;
    startScan();
  }

  function qrcodeReader(e: any) {
    try {
      let file = e.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        let img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          const context = canvas.getContext('2d');
          context.imageSmoothingEnabled = false;
          context.drawImage(img, 0, 0);
          const imageData = context.getImageData(
            0,
            0,
            img.width,
            img.height
          );
          const qrCode = jsQR(imageData.data, img.width, img.height);
          if (qrCode) {
            scanResult = qrCode.data;
            if (options?.onResulted != undefined) {
              options.onResulted(qrCode.data);
            } else {
              alert(qrCode.data);
            }
          }
        };
      };
    } catch (error) {
      console.error(error);
    }
  }
</script>

<canvas bind:this={canvas} />
<!-- svelte-ignore a11y-media-has-caption -->
<video on:canplay={onCanPlay}  class:cant-scan={!canScan} bind:this={video} />
<div class='action-footer'>
    <button class="button-neutral-solid" on:click={onBack}>
        {isBack ? 'BACK' : 'Cancel'}
    </button>

    {#if enableQRCodeReaderButton}
        <label for="upload-qrcode-image" class="button-neutral-confirm">
            {@html imageSquareIcon} Upload
        </label>
        <input
                class="image-qrcode-input"
                type="file"
                id="upload-qrcode-image"
                accept=".jpg, .jpeg, .png"
                on:change={(e) => qrcodeReader(e)}
        />
    {/if}


</div>


<style>
    canvas {
        display: none;
    }

    video {
        width: 288px;
        border-radius: 16px;
        object-fit: cover;
        height: 288px;
    }

    .image-qrcode-input {
        display: none;
    }

    .button-neutral-confirm{
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: center;
        cursor: pointer;
        gap: 4px;
        height: fit-content;
    }

    .button-neutral-confirm, .button-neutral-solid {
        font-weight: 600;
        padding: 16px;
    }
    .button-neutral-solid {
        height: 60px;
    }

    .action-footer{
        height: 100px;
        display: flex;
        gap: 24px;
        align-items: center;
        width: 100%;
    }

    .cant-scan {
        background-color: #1a1a1a;
    }
</style>
