import React from 'react'; // eslint-disable-line no-unused-vars
import { Box } from 'grommet';


export default function AboutShowMaker() {
    return (
        <div className="about-show-maker" style={{ overflowX: 'hidden' }}>
            <Box
                pad="large"
            >
                <Box>
                    <h1>Welcome to ShowMaker</h1>
                </Box>
                <h3>A few tips to get you started…</h3>
                <p>
                    ShowMaker is broken into separate screens, each of which can be
                    visited by selecting it from the menu on the left.
                </p>
                <p>
                    On narrow screens, the menu can be slid in and out by
                    sliding in and out from the left side of the screen.
                </p>
                <p>
                    The screens and their purposes are:
                </p>
                <ul>
                    <li>
                        <b>Box Office</b> contains everything you'll need when interacting
                        with attendees.  Attendees can be searched and their tickets
                        re-printed or emailed to them. Using the mobile app, tickets
                        can be scanned and redeemed.
                    </li>
                    <li>
                        <b>Shows</b> create and modify everything related to shows and
                        their information page.
                    </li>
                    <li>
                        <b>Presenters</b> shows can have be "Presented by".  You can
                        manage the names and logo's of presenters here.
                    </li>
                    <li>
                        <b>Venues</b> The physical location where a show takes place.
                    </li>
                    <li>
                        <b>Messages</b> a custom email subject, message and pdfs for the
                        ticket header and footer.  Once configured a Venue or Show can
                        optionally be configured with a Message.
                    </li>
                    <li>
                        <b>Embedding</b> configure the listings of shows.  Each embedding
                        can contain only your shows as well as other user's shows as well.
                    </li>
                    <li>
                        <b>User Management</b> Create and update users names, passwords and
                        if they're an administrator.  Only Administrators can access this
                        and the System Settings.
                    </li>
                    <li>
                        <b>System Settings</b> How ShowMaker is configured.  Set your logo's,
                        how emails will appear, and your payment settings.
                    </li>
                </ul>
            </Box>
        </div>
    );
}
