<script lang="ts">
    import { _ } from 'svelte-i18n';
    import { Modal } from '../shared';
    import en from '../../i18n/en.json';
    import caretIcon from '../../icons/caret-light.js';
    import warningIcon from '../../icons/warning.js';
    import { state } from '../../store/index.js';
    import { listMethodTypeMessage } from '@subwallet_connect/common';
    import { wallets$ } from '../../streams.js';
    import  CloseButton  from '../shared/CloseButton.svelte';

    let selectElement: HTMLSelectElement
    const wallets= $wallets$;
    const message = wallets[0].accounts[0].message;
    export let onConfirm: (value : string) => void
    export let onClose: () => void
</script>

<style>
    .content {
        padding: 1rem;
        width: 300px;
        font-family: var(--onboard-font-family-normal, var(--font-family-normal));
        font-size: var(--onboard-font-size-5, var(--font-size-5));
        line-height: 24px;
    }

    button {
        margin-top: 1.5rem;
        width: 50%;
        font-weight: 600;
    }

    .right {
        margin-left: 0.5rem;
        width: 60%;
    }

    .modal-title {

    }

    .title {
        width: 262px;
        text-align: center;
    }

</style>

<Modal close={onClose} maskClose={true}>
    <div class="modal-title" slot="title">
        <h4 class="title">
            {$_('modals.confirmSignMessage.heading', {
                default: en.modals.confirmSignMessage.heading
            })}
        </h4>
    </div>
    <div class="content" slot="content">
        {#if wallets[0].type === 'evm' }
        <p>
            {$_('modals.confirmSignMessage.evmWallet.content', {
                default: en.modals.confirmSignMessage.evmWallet.content
            })}
        </p>
        <select
                class={`flex justify-center items-center pointer maximized_ac`}
                bind:this={selectElement}
                value={listMethodTypeMessage[0]}
                style={`
    color: var(--account-center-maximized-network-selector-color,
    var(--account-center-network-selector-color, var(--gray-500)));
    background-image: url('data:image/svg+xml;utf8,${caretIcon}'); ${
    'font-weight: 0;'
  }`}
        >
            {#each listMethodTypeMessage as method}
                <option value={method}
                >{method}</option
                >
            {/each}
        </select>
            {:else if wallets[0].type === 'substrate' && wallets[0].signer}
            <p>
                {$_('modals.confirmSignMessage.substrateWallet.content', {
                    default:
                        en.modals.confirmSignMessage.substrateWallet.content
                })}
            </p>
        {/if}
    </div>
    <div class="footer" slot="footer">
        <div class="flex justify-between items-center w-100">

            <button class="right button-neutral-solid rounded" on:click={() => onConfirm( wallets[0].type === 'evm' ? selectElement.selectedOptions[0].value : 'signMessageForSubstrateWallet' )}>
                {$_('modals.confirmSignMessage.sign', {
                    default:
                    en.modals.confirmSignMessage.sign
                })}
            </button>

            <button class="button-neutral-solid-b rounded" on:click={onClose}>
                {$_('modals.confirmSignMessage.cancel', {
                    default:
                    en.modals.confirmSignMessage.cancel
                })}
            </button>

        </div>
    </div>
</Modal>
