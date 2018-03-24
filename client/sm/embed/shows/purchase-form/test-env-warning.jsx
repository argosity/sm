/** @jsx Preact.h */
import Preact from 'preact'; // eslint-disable-line no-unused-vars

export default function TestEnvWarning({ vendor }) {
    if (vendor !== 'test') { return null; }
    return (
        <div className="testing-warning">
            <div className="inner">
                <h2>FOR TESTING ONLY</h2>
                <p>
                    These shows are not real.  They are for demonstration only.
                </p>
                <p>
                    This form will accept any values, so please:
                </p>
                <p className="no-cc">
                    Do not enter any real credit card information!
                </p>
            </div>
        </div>
    );
}
