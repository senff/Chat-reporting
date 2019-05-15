**WHAT DOES IT DO?**

With this script running in Happychat, availability and coverage is being logged and recorded on a minute-by-minute basis.
By selecting the blue circle at the top right of the Happychat window, you can select a date to show a graph of that day, that visualizes how much coverage we had, and how much availability.

Example: http://www.senff.com/chat-reporting/example.png


**INSTALL THIS STUFF**

1. Install the JavaScript with Tampermonkey and the CSS with Stylus
2. Open a new tab in your browser and log in to HappyChat.  You don’t have to fully log in -- if you see the “_You got here just in time. We could really use your help._” message, it’s already good.
3. Let it run.

What happens now, is that my script will check all the availability, in 1-minute intervals, and write this data to your browser’s local history. We can’t get older data; the script really needs to run like this, to build up a collection of data.

You can leave it like this and just collect data, but you can also actually chat, if you want. As long as it’s running, it’s getting the data.

Now let it just sit there for a bit and do other stuff.


**REVIEW DATA**

You should see a blue circle at the top of your chat window.  When you select that, it will open the reporting tool.

In the textfield, enter the date of the data you want to see (so for June 23, select “6-23”).  You should then see the report for that day, or at least the data you’ve collected so far.

I think it all speaks for itself, but just to make sure:
- light grey = total throttle of all green HEs
- dark grey = total throttle of all blue HEs
- green = current chats with green HEs
- blue = current chats with blue HEs
- red = morechat indicators

If you hover your mouse over anywhere, it will show you the time (UTC), chats/thottle of greens, and chat/throttle of blues.

For example, 13:19 44/50 (3/12) means:
- 44 chats are going on while green HEs have a total throttle/availability of 50 (so, 6 slots available)
- 3 chats are going on while blue HEs have a total throttle/availabilty of 12 (so, 9 slots available)

**STUFF THAT’S NOT WORKING**

Here’s some things that are currently not working, or that I will need to fix before it’s ready for prime time:

- read/write all the data in JSON format so it can be easily converted to other formats (CSV, etc.)
- add indicators in graph (time on horizontal axis, numbers on vertical axis)
- add gaps where there’s no data (right now, if you would close your browser tab or the connection gets lost and it wouldn’t collect data, it will not add zeros while the time keeps running -- it will just not do anything at all, so it’s possible you’ll see jumps from 11:45 to 12:15, without seeing blank data for that time)
- make the date selector show for which dates reports are available
- ability to remove reports from certain dates
- save data to a file (this is probably the most important one, but also the trickiest)
