//Require module
let puppeteer = require("puppeteer");
let fs = require("fs");

// STEPS:
// no of videos done
// views done
// watch time -> get 
// list of videos -> in an excel
// initial page data get 
// handle -> loader


(async function () {
    try {
        //launch browser
        let browserInstance = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized"]
        });
        //create new tab
        let newPage = await browserInstance.newPage();
        //go to the url
        await newPage.goto("https://www.youtube.com/playlist?list=PLRBp0Fe2GpgnIh0AiYKh7o7HnYAej-5ph");
        
        let arr = await newPage.evaluate(browserconsoleFn,"#stats  .style-scope.ytd-playlist-sidebar-primary-info-renderer");
        let videoCount =arr[0].split(" ")[0]; 
        console.log(videoCount);
        videoCount = Number(videoCount);
        console.log(arr[0]);
        console.log(arr[1]);

        let pCurrentVideosCount = await scrolltoBottom(newPage,"#video-title");
        while(videoCount-50 > pCurrentVideosCount)
        {
            pCurrentVideosCount=await scrolltoBottom(newPage,"#video-title");
        }
        let timeDurArr = await newPage.evaluate(getStats,"span.style-scope.ytd-thumbnail-overlay-time-status-renderer","#video-title");
        console.table(timeDurArr);
        

    } catch (err) {
        console.log(err);
    }

})();

function browserconsoleFn(viewlink)
        {
            let arr=document.querySelectorAll(viewlink)
            let newarr=[]
            newarr.push(arr[0].innerText,arr[1].innerText);
            return newarr;
        }

async function scrolltoBottom(page,title)
{
    function getLengthConsoleFn(title)
    {
        window.scrollBy(0,window.innerHeight);
        let titleElemArr = document.querySelectorAll(title);
        console.log("titleLength",titleElemArr.length);
        return titleElemArr.length;
    }
    return page.evaluate(getLengthConsoleFn,title);
}

function getStats(durationSelect , title)
{
    let dElemarr = document.querySelectorAll(durationSelect);
    let titleElemArr = document.querySelectorAll(title);
    let numeNdurArr=[];
    for(let i=0;i<dElemarr.length;i++)
    {
        let duration = dElemarr[i].innerText;
        let title = titleElemArr[i].innerText;
        numeNdurArr.push({duration,title});
    }
    return numeNdurArr;
}





