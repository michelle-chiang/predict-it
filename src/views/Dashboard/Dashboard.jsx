import React, { Component } from 'react';
import ChartistGraph from 'react-chartist';
import Chartist from 'chartist';
import { Grid, Row, Col } from 'react-bootstrap';
// import $ from 'jquery';

import {Card} from 'components/Card/Card.jsx';
import {StatsCard} from 'components/StatsCard/StatsCard.jsx';
// import Button from 'elements/CustomButton/CustomButton.jsx';

import {
    // dataSales,
    optionsSales,
    responsiveSales,
    // legendSales,
    dataBar,
    today,
    optionsBar,
    responsiveBar,
    legendBar,
    // vegetablesNeeded,

    generateDataSet,
    // daysOfWeek, 
    // monthsOfYear

} from 'variables/Variables.jsx';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: '2018/04/15',
            endDate: '2018/04/21',
            database: 'catPred', // start off with categories graph
            predictor: '',
            graphData: {
                labels: [],
                series: []
            },
            legend: {
                names: []
            },

        };
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateGraphData = this.updateGraphData.bind(this);
        this.renderGraphData = this.renderGraphData.bind(this);
    }

    updateGraphData() {
        // reset predictor if not applicable
        if (this.state.database !== 'ingPred') {
            this.state.predictor = '';
        }
        // TODO: reset label?
        var newData = generateDataSet(this.state.startDate, this.state.endDate, this.state.database, this.state.predictor)
        if (newData) {
            this.state.graphData = newData[0];
            this.state.legend = newData[1];
        }
    }

    renderGraphData(graphData) {
        this.updateGraphData();
        return this.state.graphData;
    }

    handleStartDateChange(event) {
        // TODO: add red warning if date not formatted correctly
        this.setState({startDate: event.target.value});
    }

    handleEndDateChange(event) {
        // TODO: add red warning if date not formatted correctly
        this.setState({endDate: event.target.value});   
    }

    handleSubmit(event) {
        // TODO: update data object by using generate dataset function
        // console.log(this.state.startDate, this.state.endDate)
        event.preventDefault();
    }

    changeChartData(database, predictor="") {
        this.setState({database: database});
        if (predictor) {
            this.setState({predictor: predictor});
        }
        this.updateGraphData();
        console.log("graphData:", this.state.graphData);
        // var chart = document.getElementById(id);
        // if (chart) {
            // var parent = chart.parentNode;
            // parent.removeChild(chart);

            // parent.setAttribute("id","chart-" + dataSeries.name)
            // new Chartist.Line("#chart-" + dataSeries.name, {
            //     labels: dataSeries.labels,
            //     series: dataSeries.series,
            //     options: optionsSales
            // })
            // // TODO: add footer / legend
            // <div className="legend">
            //     {this.createLegend(legendSales, "chartHours")}
            // </div>
        // }
    };

    createLegend(json, dynamic=false) {
        var graphColor = ["a","b","c","d","e"];
        var legend = [];
        var num_items = json["names"].length;

        for(var i = 0; i < num_items; i++){
            var type="fa fa-circle legend-"+graphColor[i];
            if (dynamic) {
               legend.push(
                    <button key={i} onClick={() => this.changeChartData('ingPred', json["names"][i])}>
                        <i className={type}></i>
                        <span>{json["names"][i]}</span>
                    </button>
                ); 
            } else {
                legend.push(
                    <i className={type} key={i}></i>
                );
                legend.push(" ");
                legend.push(
                    json["names"][i]
                ); 
            }
        } 
        return legend;
    }

    render() {
        return (
            <div className="content">
                <form onSubmit={this.handleSubmit}>
                    <label> Dates:&nbsp;
                        <input type="text" placeholder="YYYY/MM/DD" value={this.state.startDate} onChange={this.handleStartDateChange}/>
                        &nbsp;-&nbsp;
                        <input type="text" placeholder="YYYY/MM/DD" value={this.state.endDate} onChange={this.handleEndDateChange}/>
                    </label>&nbsp;
                    <input type="submit" value="Submit"/>
                </form>
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Card
                                // statsIcon="fa fa-history"
                                id="chartHours"
                                title={"Ingredients Needed: " + this.state.startDate + " - " + this.state.endDate}
                                category="Past Data and Predicted Future Needs (lb)"
                                // startDate, endDate, database, labels, predictor=""
                                content={
                                    <div className="ct-chart" id="chartHours">
                                        <ChartistGraph
                                            data={this.renderGraphData(this.state.graphData)}
                                            // data={this.state.graphData}
                                            // data={generateDataSet(this.state.startDate, this.state.endDate, 'catPred', daysOfWeek)[0]}
                                            type="Line"
                                            options={optionsSales}
                                            // responsiveOptions={responsiveSales}
                                        />
                                    </div>
                                }
                                legend={
                                    <div className="legend">
                                        {this.createLegend(this.state.legend, true)}
                                    </div>
                                }
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Card
                                id="chartActivity"
                                title="2017 Sales"
                                category="Sales per month"
                                // stats="in thousands of dollars"
                                // statsIcon="fa fa-check"
                                content={
                                    <div className="ct-chart">
                                        <ChartistGraph
                                            data={dataBar}
                                            type="Bar"
                                            options={optionsBar}
                                            responsiveOptions={responsiveBar}
                                        />
                                    </div>
                                }
                                legend={
                                    <div className="legend">
                                        {this.createLegend(legendBar)}
                                    </div>
                                }
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={3} sm={6}>
                            <StatsCard
                                bigIcon={<i className="pe-7s-date text-warning"></i>}
                                statsText="Today is..."
                                statsValue={today}
                                statsIcon={<i className="fa fa-refresh"></i>}
                                statsIconText="Updated now"
                            />
                        </Col>
                        <Col lg={3} sm={6}>
                            <StatsCard
                                bigIcon={<i className="pe-7s-wallet text-success"></i>}
                                statsText="Revenue"
                                statsValue="$1,345"
                                statsIcon={<i className="fa fa-calendar-o"></i>}
                                statsIconText="Last day"
                            />
                        </Col>
                        <Col lg={3} sm={6}>
                            <StatsCard
                                bigIcon={<i className="pe-7s-graph1 text-danger"></i>}
                                statsText="Customers"
                                statsValue="23"
                                statsIcon={<i className="fa fa-clock-o"></i>}
                                statsIconText="In the last hour"
                            />
                        </Col>
                        <Col lg={3} sm={6}>
                            <StatsCard
                                bigIcon={<i className="fa fa-twitter text-info"></i>}
                                statsText="Followers"
                                statsValue="+45"
                                statsIcon={<i className="fa fa-refresh"></i>}
                                statsIconText="Updated now"
                            />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default Dashboard;

// <Button bsStyle="default" block onClick={() => this.props.handleClick('tl')}>Top Left</Button>
