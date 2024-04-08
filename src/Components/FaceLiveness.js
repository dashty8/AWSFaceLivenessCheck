import React from "react";
import { useEffect } from "react";
import { Loader } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness';


function FaceLiveness({faceLivenessAnalysis}) {
    const [loading, setLoading] = React.useState(true);
    const [sessionId, setSessionId] = React.useState(null)


    useEffect(() => {
        const fetchCreateLiveness = async () => {
            const response = await fetch('https://73zjo7bktcczu3tov53t52lzui0meevu.lambda-url.us-east-1.on.aws/');
            const data = await response.json();
            setSessionId(data.sessionId)
            setLoading(false);

        };
        fetchCreateLiveness();

    },[])

    const handleAnalysisComplete = async () => {
        const response = await fetch('https://zdt3fnz2ipnw4aw3gpzuhyhey40mfakn.lambda-url.us-east-1.on.aws/',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sessionid: sessionId })
            }

        );
        const data = await response.json();
        faceLivenessAnalysis(data.body)
    };

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <FaceLivenessDetector
                    sessionId={sessionId}
                    region="us-east-1"
                    onAnalysisComplete={handleAnalysisComplete}
                    onError={(error) => {
                        console.error(error);
                      }}
                />
            )}
        </>
    );
}

export default FaceLiveness;