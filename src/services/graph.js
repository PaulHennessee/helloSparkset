import * as MicrosoftGraph from "@microsoft/microsoft-graph-client";
import * as momentT from "moment-timezone";
//import * as moment from "moment";
import {getToken } from "./auth.js";

// Create an authentication provider
const authProvider = {
    getAccessToken: async () => {
      // Call getToken in auth.js
      return await getToken();
    }
  };
  
// Initialize the Graph client
const graphClient = MicrosoftGraph.Client.initWithMiddleware({authProvider});

async function getUser() {
    return await graphClient
      .api('/me')
      // Only get the fields used by the app
      .select('id,displayName,mail,userPrincipalName,mailboxSettings')
      .get();
}

async function getEvents() {
    const user = JSON.parse(sessionStorage.getItem('graphUser'));
  
    // Convert user's Windows time zone ("Pacific Standard Time")
    // to IANA format ("America/Los_Angeles")
    // Moment needs IANA format
    let ianaTimeZone = momentT.getIanaFromWindows(user.mailboxSettings.timeZone);
    console.log(`Converted: ${ianaTimeZone}`);
  
    /*
    // Configure a calendar view for the current week
    // Get midnight on the start of the current week in the user's timezone,
    // but in UTC. For example, for Pacific Standard Time, the time value would be
    // 07:00:00Z
    let startOfWeek = moment.tz('America/Los_Angeles').startOf('week').utc();
    // Set end of the view to 7 days after start of week
    let endOfWeek = moment(startOfWeek).add(7, 'day');
  
    */
    try {
      // GET /me/calendarview?startDateTime=''&endDateTime=''
      // &$select=subject,organizer,start,end
      // &$orderby=start/dateTime
      // &$top=50

      /* currently not using in test
      let response = await graphClient
        .api('/me/calendarview')
        // Set the Prefer=outlook.timezone header so date/times are in
        // user's preferred time zone
        .header("Prefer", `outlook.timezone="${user.mailboxSettings.timeZone}"`)
        // Add the startDateTime and endDateTime query parameters
        .query({ startDateTime: startOfWeek.format(), endDateTime: endOfWeek.format() })
        // Select just the fields we are interested in
        .select('subject,organizer,start,end')
        // Sort the results by start, earliest first
        .orderby('start/dateTime')
        // Maximum 50 events in response
        .top(50)
        .get();
      */
     
      //updatePage(Views.calendar, response.value);             // update in vue component
    } catch (error) {
        console.log('Error getting events'); //we added this
      //updatePage(Views.error, {                               // update in vue component
      //  message: 'Error getting events',
      //  debug: error
      //});
    }
  }

  async function createNewEvent() {
    const user = JSON.parse(sessionStorage.getItem('graphUser'));
  
    // Get the user's input

    //const subject = document.getElementById('ev-subject').value;      // might have to change these lines too
    //const attendees = document.getElementById('ev-attendees').value;
    //const start = document.getElementById('ev-start').value;
    //const end = document.getElementById('ev-end').value;
    //const body = document.getElementById('ev-body').value;

   // const subject = "";
  


    // Require at least subject, start, and end
    if (!subject || !start || !end) {                       // update in vue component
      updatePage(Views.error, {                     
        message: 'Please provide a subject, start, and end.'
      });
      return;
    }
  
    // Build the JSON payload of the event
    let newEvent = {
      subject: subject,
      start: {
        dateTime: start,
        timeZone: user.mailboxSettings.timeZone
      },
      end: {
        dateTime: end,
        timeZone: user.mailboxSettings.timeZone
      }
    };
  
    if (attendees)
    {
      const attendeeArray = attendees.split(';');
      newEvent.attendees = [];
  
      for (const attendee of attendeeArray) {
        if (attendee.length > 0) {
          newEvent.attendees.push({
            type: 'required',
            emailAddress: {
              address: attendee
            }
          });
        }
      }
    }
  
    if (body)
    {
      newEvent.body = {
        contentType: 'text',
        content: body
      };
    }
  
    try {
      // POST the JSON to the /me/events endpoint
      await graphClient
        .api('/me/events')
        .post(newEvent);
  
      // Return to the calendar view
      //getEvents();
    } catch (error) {
        console.log("Error creating event");
      //updatePage(Views.error, {                              // update in vue component
      //  message: 'Error creating event',
      //  debug: error
      //});
    }
}
export default {getUser, getEvents, createNewEvent, user, response}; 