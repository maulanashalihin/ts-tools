<script>

import {clickOutside} from './helper.js';
import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();


    export let value;
    export let placeholder;
    export let lists = [];


    let valueText = ""

    let show_listed = lists.slice(0,5);

    if(value)
    {
        const find  = lists.find(item=>{
            return item.value == value;
        })
        if(find)
        {
            valueText = find.label;
            handleInput()
        }
    }

   

    export let id = "default-id";
    let show = false;

    function handleInput()
    {
        show_listed = lists.filter(item=>{
            return item.label.toLowerCase().includes(valueText.toLowerCase())
        }).slice(0,5)
    }


    function updateValue(item)
    { 
        valueText = item.label;
        value = item.value;
        show = false;
        dispatch('change',item);

    }
</script>
<div use:clickOutside on:click_outside={()=>{show = false;}}>
    <div class="relative inline-block w-full">
        <input autocomplete="off" bind:value="{valueText}" on:input={handleInput} on:focus={()=>{show = true}}   class="w-full block border border-gray-200 rounded px-3 py-2 leading-6 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" type="text" id="{id}" placeholder="{placeholder}" />
        {#if show}
        <div role="menu" aria-labelledby="tk-dropdown-simple" class="absolute left-0 origin-top-left mt-2 w-full shadow-xl rounded z-1">
            <div class="bg-white ring-1 ring-black ring-opacity-5 rounded divide-y divide-gray-100">
                <div class="p-2 space-y-1">
                    {#each show_listed as item}
                         
                         <!-- content here --> 
                         <!-- svelte-ignore a11y-click-events-have-key-events -->
                         <!-- svelte-ignore a11y-invalid-attribute -->
                         <a href="javascript:void(0)"  role="menuitem" on:click="{()=>{updateValue(item)}}" class="cursor-pointer flex items-center space-x-2 rounded py-2 px-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:bg-gray-100 focus:text-gray-700">
                            <span>{item.label}</span>
                         </a> 
                    {/each}
                   
                </div> 
            </div>
        </div>
        {/if}
    </div>
</div>