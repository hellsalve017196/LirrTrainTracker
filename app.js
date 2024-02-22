import { chromium } from 'playwright';
// google sheet
import { google } from "googleapis";


const trainBranchs = [
    'Babylon',
    'Far Rockaway',
    'Hempstead',
    'Long Beach',
    'Montauk',
    'Oyster Bay',
    'Port Jefferson',
    'Huntington',
    'Port Washington',
    'Ronkonkoma',
    'West Hempstead'
];


async function uploadTrainData(trainTime) {
        const auth = new google.auth.GoogleAuth({
            keyFile: "/home/pi/projects/trainTime/credentials.json",
            scopes: "https://www.googleapis.com/auth/spreadsheets",
          });

          // Create client instance for auth
          const client = await auth.getClient();

          // Instance of Google Sheets API
          const googleSheets = google.sheets({ version: "v4", auth: client });

          const spreadsheetId = "1ew84lPR1NX9x0D1zYHmGLUOYknz80U90JMUXm8A_L";

          // Get metadata about spreadsheet
          const metaData = await googleSheets.spreadsheets.get({
            auth,
            spreadsheetId,
          });

          try {
              // Write row(s) to spreadsheet
	        const response =  await googleSheets.spreadsheets.values.append({
	            auth,
	            spreadsheetId,
	            range: "Sheet1!A1:D5",
	            valueInputOption: "USER_ENTERED",
	            resource: {
	            values: [
	                trainTime
	            ]
	            },
	        });

                console.log("Value uploaded to Google successfully");
                return response;
          }
	  catch(error) {
		console.log(`Error Upload to Google: ${error}`);
          }

    };



    /**  input for the train Time  */
    async function input(page, trainBranch) {
        await page.waitForTimeout(8000);

        await page.goto('https://new.mta.info/schedules');
        await page.locator('#from-autocomplete div').filter({ hasText: 'FromChoose Station' }).locator('div').nth(2).click();
        await page.locator('#from-autocomplete-input').fill('pe');
        await page.locator('#react-select-2-option-166').click();
        await page.locator('#to-autocomplete div').filter({ hasText: 'ToChoose Station' }).locator('div').nth(2).click();
        await page.locator('#to-autocomplete-input').fill(trainBranch);
        await page.getByText(trainBranch, { exact: true }).click();
        await page.getByRole('button', { name: 'Find Schedules' }).click();
    };



    /** extracting Data */
    async function dataExtraction(page,currentTime,trainBranch) {
        // wating on page to load
        await page.waitForTimeout(8000);

        // Get all the buttons under the mta-section div
        const buttons = await page.$$('.mta-section button.bg-white');
        let trainTrackDetail;

        // Loop through each button
        for (let button of buttons) {

            const fullText = await button.innerText();

            // First check if the trackInfo is defined
            let trackInfo;
            try {
                const fullText = await button.innerText();
                trainTrackDetail = fullText.split('\n');

                for(let i=0;i < trainTrackDetail.length;i++) {
                    if(trainTrackDetail[i].includes('Track')) {
                        trackInfo = trainTrackDetail[i];
                    }
                }

            } catch (error) {
                // Element might not exist, so set trackInfo to undefined
                trackInfo = undefined;
            }

            if (trackInfo) {  // If trackInfo is defined
                if(trainTrackDetail.length === 8) {
                    console.log("*****start****")
                    var trainTime = trainTrackDetail[0]+"-"+trainTrackDetail[2];
                    var trainName = trainTrackDetail[5];

                    console.log(`trainName:${trainName},time:${trainTime},track:${trackInfo}`)


                    // uploadTrainData({
                    //     TraineName: trainBranch,
                    //     arrivalTime: trainTrackDetail[2],
                    //     departureTime: trainTrackDetail[0],
                    //     trackNumber: trackInfo,
                    //     checkedIn: currentTime
                    // });

                    await uploadTrainData([
                        trainBranch,
                        trainTrackDetail[2],
                        trainTrackDetail[0],
                        trackInfo,
                        currentTime
                    ]);
                    console.log("*****end****")
                }

                // console.log(`Location: ${locationText}, Track Time: ${trackTime}, Track Info: ${trackInfo}`);
            }

        }
    };


    async function main() {
        try
        {
            let currentTime = Date.now();

            for(const trainBranch of trainBranchs)
            {
                const browser = await chromium.launch({
                    headless: true,
                    executablePath: '/usr/bin/chromium-browser'
                });

                const page = await browser.newPage();
                await page.goto('https://new.mta.info/schedules');

                //console.log(trainBranch);

                // giving input
                await input(page, trainBranch);

                // extracting data
                let trainTimeTableForEachBranch = await dataExtraction(page,currentTime,trainBranch);

                await browser.close();
            };
        }
        catch(err) {
            console.error(err.message);
        }
    };


/** starting the app */

main();
