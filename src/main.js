import React from 'react';
import './main.css';

export class Main extends React.Component {
    state = {
        results: [],
        stop: false,
        index: '',
        totalCountCheck: ''
    }

     httpGet = async (theUrl) =>
    {
        const response = await fetch(theUrl)
        return response.json();
    }

    stop = () => {
        this.setState({stop: true})
    }

    processRes = (subjectResults) => {
        let countA = 0;
        let countB = 0;
        let countC = 0;
        let countS = 0;
        let countW = 0;
        let countWaiting = 0;

        for (const subjectResult of subjectResults) {
            switch (subjectResult.subjectResult) {
                case 'A':
                    countA++
                    break;
                case 'B':
                    countB++
                    break;
                case 'C':
                    countC++
                    break
                case 'S':
                    countS++
                    break
                case 'W':
                    countW++
                    break
                default:
                    countWaiting++
                    break
            }
        }
        let txt = countA > 0 ? countA + 'A ' : ''
        txt += countB > 0 ? countB + 'B ' : ''
        txt += countC > 0 ? countC + 'C ' : ''
        txt += countS > 0 ? countS + 'S ' : ''
        txt += countW > 0 ? countW + 'W ' : ''
        txt += countWaiting > 0 ? countWaiting + 'Waiting ' : ''
        return txt
    }

    getInput = (e, key) => {
        var obj = {}
        obj[key] = e.target.value
        this.setState(obj)
    }

    onStart = async () => {

        console.log(this.state)
        //65625700
        const b = Number(this.state.index)
        const c = Number(this.state.totalCountCheck)

        if (c > 0) {
            for (var xDec = b; xDec > b - c; xDec--) {
                if (this.state.stop) {
                    break;
                }
                const yy = "https://result.doenets.lk/result/service/OlResult?index=" + xDec + "&nic=";
                const res = await this.httpGet(yy);
                if (res.name !== null) {
                    this.setState({results: [...this.state.results, {
                            name : res.name,
                            res: this.processRes(res.subjectResults),
                            indexNumber: xDec
                        }]})
                }
            }
        } else {
            for (var xInc = b; xInc < b - c; xInc++) {
                if (this.state.stop) {
                    break;
                }
                const yy = "https://result.doenets.lk/result/service/OlResult?index=" + xInc + "&nic=";
                const res = await this.httpGet(yy);
                if (res.name !== null) {
                    this.setState({results: [...this.state.results, {
                            name : res.name,
                            res: this.processRes(res.subjectResults),
                            indexNumber: xInc
                            //subRes: JSON.stringify(res.subjectResults)
                        }]})
                }
            }
        }

    }

    resView = (ss) => {
        return(
            <table>
                <tr>
                    <th>Name</th>
                    <th>Index</th>
                    <th>Results</th>
                </tr>
                {
                    ss.map(s => {
                        return (
                            <tr>
                                <td>{s.name}</td>
                                <td>{s.indexNumber}</td>
                                <td>
                                    {s.res}
                                    &nbsp;
                                   {/* <div className="tooltip">results
                                        <span className="tooltiptext">{s.subRes}</span>
                                    </div>*/}
                                </td>
                            </tr>
                        )
                    })}
            </table>
        )
    }

//65625700 - shanmuga

    async componentDidMount() {
    }

    render() {
        const ss = this.state.results;
        return(
            <div>
                <input  placeholder={'Enter Index'} onChange={e => {this.getInput(e, 'index')}}/>
                <input  placeholder={'Count'} onChange={e => {this.getInput(e, 'totalCountCheck')}}/>
                <button onClick={this.onStart}>Start</button>
                <button onClick={this.stop}>Stop</button>
                <br></br>
                <br></br>
                {this.resView(ss)}
            </div>
        )
    }
}