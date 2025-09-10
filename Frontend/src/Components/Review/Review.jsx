import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import axios from 'axios'
import './Review.css'
import API from '../../api';

function Review() {
    const [code, setCode] = useState(`function sum() { return a + 1 }`)
    const [review, setReview] = useState('')
    const [loading, setLoading] = useState(false)
    const [clicked, setClicked] = useState(false)

    useEffect(() => {
        prism.highlightAll()
    }, [])

    async function reviewCode() {
        setClicked(true);
        setTimeout(() => setClicked(false), 150);
        setReview('');
        setLoading(true);
        try {
            const response = await API.post('/ai/get-review', { code });
            setReview(response.data);
        } catch (err) {
            setReview('Error fetching review');
            console.error(err);
        }
        setLoading(false);
    }

    return (
        <main className="review-root">
            <div className="left">
                <div className="code">
                    <Editor
                        value={code}
                        placeholder='Write your code here to review...'
                        onValueChange={code => setCode(code)}
                        highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
                        padding={10}
                        style={{
                            fontFamily: '"Fira code", "Fira Mono", monospace',
                            fontSize: 16,
                            border: "1px solid #ddd",
                            borderRadius: "0.7rem",
                            height: "100%",
                            width: "100%",
                            backgroundColor: "#2d2d2d",
                            color: "#f8f8f2",
                            overflow: "auto"
                        }}
                    />
                </div>
                <div
                    onClick={reviewCode}
                    className={`review ${clicked ? 'clicked' : ''} ${loading ? 'loading' : ''}`}
                >
                    {loading ? <div className="spinner"></div> : 'Review'}
                </div>
            </div>
            <div className="right">
                {review ? (
                    <Markdown rehypePlugins={[rehypeHighlight]}>
                        {review}
                    </Markdown>
                ) : (
                    <p className="placeholder">Code review will appear here...</p>
                )}
            </div>

        </main>
    )
}

export default Review
