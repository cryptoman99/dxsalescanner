# DXSale Scanner

Disclaimer: this script hasn’t been thoroughly tested, so there will be some quirks. Suggestions and feedback really welcome. Github page is here: https://github.com/cryptoman99/dxsalescanner/

Sharing with everyone a tamper monkey script I created which tells you which projects you have contributed BNB towards on DXsale. It pretty much goes through ALL projects on DXSale and checks what is your contributed amount. 

Each page load is around 3 seconds, and there’s a couple of thousands of projects. You can leave this running in the background, whilst it does its job. Output is captured in localStorage, which can be accessed through Inspect > Application > Local Storage > http://Dxsale.app. Example output: 
![Pasted Graphic](https://user-images.githubusercontent.com/83321328/137637579-bed732a9-f92a-4a72-8c21-53df1016bff4.png)

## Steps: 
1. Have chrome (not sure about Firefox) and install tamper monkey
2. Add a new script in the TamperMonkey dashboard
3. Enable the script 
4. Visit this page to get the process started (this is the last token of v1 Dxsale):  https://dxsale.app/app/pages/presale?saleID=261
5. Make sure to disable the script after its run, so it won’t interfere with your Dxsale experience later!

## How it works:
1. Loads the Dxsale token page and checks the contributed amount
2. If saleId = 0, on to the next API version of dxsale
3. If saleId != 0, decrement the saleId and load the next page


## Contact

https://twitter.com/IntoTheDoge
