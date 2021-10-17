// ==UserScript==
// @name         Check dxsale
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Check DXsale for all of the tokens you contributed BNB to
// @author       CoolDoge
// @match        https://dxsale.app/app/*
// @icon         https://www.google.com/s2/favicons?domain=dxsale.app
// @require https://gist.github.com/raw/2625891/waitForKeyElements.js
// @require http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant        none
// @run-at document-idle
// @noframes
/* globals jQuery, $, waitForKeyElements */
// ==/UserScript==

// Change this to make the scan faster, but setting it too low will cause the 
// contributed amount to always be zero. 
const TIMEOUT_PAGE_LOAD = 2000;

const URLS = [
    // DxLaunch v1 standard URL 
    'https://dxsale.app/app/pages/presale?saleID=',

    // DxLaunch v1 DeFi URL
    'https://dxsale.app/app/pages/defipresalev1?saleID=',

    // DxLaunch v2.5
    'https://dxsale.app/app/pages/defipresale?saleID=',

    // DxLaunch v2.9
    'https://dxsale.app/app/v2_9/defipresale?saleID=',

    // DxLaunch v3
    'https://dxsale.app/app/v3/defipresale?saleID=',
];

// Hardcoded value, as the archived dxsales pages won't update anyway
const NUM_SALES = [
    262, // DxLaunch v1 standard
    2117, // DxLaunch v1 DeFi
    5015, // DxLaunch v2.5
    2980, // DxLaunch v2.9
    919, // DxLaunch v3
];

const CONTRIB_LABEL = "Your Contributed Amount:";
let saleId = 0;


function checkElements(elem){
    $(elem[0]).trigger('click');
    $('button:contains("Confirm")').trigger('click');
}

function jDirectTextSelector(partialText){
    return ":contains('"+partialText+"'):not(:has(:contains('" + partialText+"')))";
}

function getFullTextNode(node){
    console.log($(node).text());
    let contribAmount = $(node).text();
    contribAmount = contribAmount.substring(CONTRIB_LABEL.length);
    console.log("Contributed Amount: " + contribAmount);
    if(contribAmount !== "0.00 BNB"){
        const json = {
            url: window.location.href,
            contribAmount,
            saleId,
        };
        localStorage.setItem("dxSale" +saleId, JSON.stringify(json) );
    }

    let newUrl = '';
    const currentUrl = window.location.href;
    const urlPrefix = currentUrl.substring(0, currentUrl.indexOf('=')+1);
    console.log(urlPrefix);
    let done = false;
    if(parseInt(saleId) === 0){
        // we're done with this URL, onto the next one
        const i = URLS.indexOf(urlPrefix);
        if (i < URLS.length - 1 ){
            newUrl = URLS[i + 1];
            saleId = NUM_SALES[i+1] - 1;
        }else{
            console.log('DONE!');
            done = true;
        }
    }else{
        newUrl = urlPrefix;
    }
    if(!done){
        const newId = parseInt(saleId) - 1;
        window.location.href = newUrl + newId;
    }
}

(function() {
    'use strict';
    // wait for the popup to load, then check the box to close it
    waitForKeyElements ("input[type=checkbox]", checkElements);
    
    const currentUrl = window.location.href;

    saleId = currentUrl.substring(currentUrl.indexOf('=')+1);
    saleId = saleId.includes('&') ? saleId.substring(0, saleId.indexOf('&')) : saleId;
    console.log(currentUrl + " " + saleId);

    // add a timeout for all the information to load on the page
    // waiting for key elements is difficult as they vary across the different versions
    setTimeout(function() {
        // wait for the Contributed amount textbox to appear, then store if not 0 BNB
        // TODO: if internet is slow, this might appear but not have been populated, increase timeout
        const selector = jDirectTextSelector(CONTRIB_LABEL);
        waitForKeyElements(selector, getFullTextNode);
    }, TIMEOUT_PAGE_LOAD);
})();

