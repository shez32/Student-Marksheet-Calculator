import React, { useState } from 'react'
import axios from "axios"

export default function Form() {
   
    //Local States 
    let [arr, setArr] = useState([]);
    let [subjects, setSubjects] = useState([]);
    let [response, setResponse] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();

        await axios.post(`/api/calculate`, subjects)
            .then((res) => {
                setResponse(res.data.data.doc)
                alert(res.data.status)
            })
            .catch((err) => console.log(err.request.response))
    }
    const handleChange = (e, name) => {
        const key = name.split('_');
        const sub = [...subjects];
        if (key[0] == 'key') {
            sub[key[1]].name = e.target.value
        }
        else {
            sub[key[1]].obtainedMarks = parseInt(e.target.value);
        }
        setSubjects(sub);
    }
    return (
        <div className="container">
            <div className="row d-flex justify-content-center py-4">
                {/* Left col */}
                <div className="col-8 col-md-4">
                    <form>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1" className="font-weight-bold text-uppercase">Name:</label>
                            <input placeholder="Enter your name" type="email" className="form-control text-capitalize" aria-describedby="emailHelp" />
                        </div>
                        <div className="form-group">
                        <label htmlFor="inlineFormCustomSelect" className="font-weight-bold text-uppercase">Number of Subjects:</label>
                            <select placeholder="Total Subject" className="custom-select mr-sm-2" id="inlineFormCustomSelect" onChange={(e) => {
                                const val = e.target.value;
                                let arrLength = (Array.from(Array(parseInt(val)).keys()))
                                if (!isNaN(val)) {
                                    const finalState = [];
                                    arrLength.map(() => {
                                        const obj = {
                                            name: '',
                                            obtainedMarks: ''
                                        }
                                        finalState.push(obj)
                                    })
                                    setSubjects(finalState)
                                    setArr(Array.from(Array(parseInt(val)).keys()))
                                }
                            }
                            }>
                                <option value={1}>One</option>
                                <option value={2}>Two</option>
                                <option value={3}>Three</option>
                                <option value={4}>Four</option>
                                <option value={5}>Five</option>
                                <option value={6}>Six</option>
                                <option value={7}>Seven</option>
                                <option value={8}>Eight</option>
                            </select>
                        </div>
                    </form>
                    {/* Left column closing tag */}
                </div>
                {/* Right column */}
                <div className="col-12 col-md-10 col-lg-8 ">
                    <form onSubmit={handleSubmit}>
                        {arr ? arr.map((obj, i) =>
                            <div key={i} className="form-group d-flex align-items-center">
                                <label htmlFor="exampleInputEmail1" className="font-weight-bold">Subject {i + 1 + " :"}</label>
                                <input
                                    value={subjects[i].name}
                                    required
                                    onChange={(e) => handleChange(e, `key_${i}`)} placeholder="Enter subject name" type="name" className="mx-4 form-control text-capitalize" />
                                <input
                                    value={subjects[i].obtainedMarks}
                                    required
                                    onChange={(e) => handleChange(e, `val_${i}`)}
                                    placeholder="Marks Obtained" type="number" max="100" className="form-control mr-4" />
                            </div>
                        )
                            : null}
                        <button type="submit" className="btn btn-block btn-warning font-weight-bold text-uppercase" style={{ display: `${arr.length ? 'inherit' : "none"}` }}>Submit</button>
                    </form>
                </div>
            </div>
            <hr />
            {/* Row 2 server */}
            <div className="row">
                <div className="col-12">
                    {response ?
                        <form>
                            <div className="form-group d-flex align-items-center">
                                <label htmlFor="exampleInputEmail1" className="font-weight-bold">Maximum Marks Subject:</label>
                                <input value={response.maxSubject} disabled className="mx-4 form-control text-capitalize" />
                                <input value={response.maxMarks} className="text-capitalize form-control mr-4" disabled />
                            </div>
                            <div className="text-capitalize form-group d-flex align-items-center">
                                <label htmlFor="exampleInputEmail1" className="text-capitalize font-weight-bold">Minimum Marks Subject:</label>
                                <input value={response.minSubject} disabled className="text-capitalize mx-4 form-control" />
                                <input value={response.minMarks} className="text-capitalize form-control mr-4" disabled />
                            </div>
                            <div className="text-capitalize form-group d-flex align-items-center">
                                <h5 className="text-capitalize font-weight-bold">Total Percentage:</h5>
                                <h5 className="text-capitalize ml-2">{response.percentage}%</h5>
                            </div>
                        </form>
                        : null}
                </div>
            </div>
            {/* Container closing tag */}
        </div >
    )
}
