import React, { Component } from 'react';
import ChartistGraph from 'react-chartist';
import Chartist from 'chartist';
import { Grid, Row, Col } from 'react-bootstrap';
// import $ from 'jquery';

import {Card} from 'components/Card/Card.jsx';
import {StatsCard} from 'components/StatsCard/StatsCard.jsx';

import {
    today,
    generateDataSet,
    optionsSales,
    dataBar,
    legendBar,
    optionsBar,
    responsiveBar,
    dataPie,
    legendPie
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
        // this.handleSubmit = this.handleSubmit.bind(this);
        this.updateGraphData = this.updateGraphData.bind(this);
        this.renderGraphData = this.renderGraphData.bind(this);
        this.changeChartData = this.changeChartData.bind(this);
        this.buttonRedirect = this.buttonRedirect.bind(this);
    }

    updateGraphData() {
        // reset predictor if not applicable
        // if (this.state.database !== 'ingPred') {
        //     this.state.predictor = '';
        // }
        var newData = generateDataSet(this.state.startDate, this.state.endDate, this.state.database, this.state.predictor)
        if (newData) {
            this.state.graphData = newData[0];
            this.state.legend = newData[1];
        }
    }

    renderGraphData() {
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

    // handleSubmit(event) {
    //     // TODO: update data object by using generate dataset function
    //     // console.log(this.state.startDate, this.state.endDate)
    //     event.preventDefault();
    // }

    changeChartData(database, predictor) {
        this.setState({database: database});
        if (predictor) {
            this.setState({predictor: predictor});
        }
    };

    buttonRedirect(event) {
        var predictor;
        try {
            predictor = event.target.getElementsByTagName("span")[0].innerHTML;
        } catch(error) {
            predictor = event.target.innerHTML;
        }
        this.changeChartData('ingPred', predictor);
        // console.log(predictor);
    }

    createLegend(json, dynamic=false) {
        var legend = [];
        var num_items = json["names"].length;
        var name;

        for(var i = 0; i < num_items; i++){
            var type="fa fa-circle legend-"+String.fromCharCode(97+i);
            if (dynamic) {
                legend.push(
                    <button key={i} onClick={this.buttonRedirect}>
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
                <form>
                    <label> Dates:&nbsp;
                        <input type="text" placeholder="YYYY/MM/DD" value={this.state.startDate} onChange={this.handleStartDateChange}/>
                        &nbsp;-&nbsp;
                        <input type="text" placeholder="YYYY/MM/DD" value={this.state.endDate} onChange={this.handleEndDateChange}/>
                    </label>&nbsp;
                </form>
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Card
                                id="ingredientChart"
                                title={"Ingredients Needed: " + this.state.startDate + " - " + this.state.endDate}
                                category="Past Data and Predicted Future Needs (in lb)"
                                content={
                                    <div className="ct-chart" id="ingredientChart">
                                        <ChartistGraph
                                            data={this.renderGraphData()}
                                            type="Line"
                                            options={optionsSales}
                                        />
                                    </div>
                                }
                                legend={
                                    <div className="legend">
                                        {this.createLegend(this.state.legend, this.state.database === 'catPred')}
                                    </div>
                                }
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <Card
                                id="chartActivity"
                                title={"Menu Items Sold: " + this.state.startDate + " - " + this.state.endDate}
                                category="Past and Predicted Future Needs (in units)"
                                content={
                                    <div className="ct-chart">
                                        <ChartistGraph
                                            data={generateDataSet(this.state.startDate, this.state.endDate, 'itemsSold')[0]}
                                            type="Line"
                                            options={optionsSales}
                                        />
                                    </div>
                                }
                                legend={
                                    <div className="legend">
                                        {this.createLegend(generateDataSet(this.state.startDate, this.state.endDate, 'itemsSold')[1])}
                                    </div>
                                }
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={8}>
                            <Card
                                id="chartActivity"
                                title="2017 Sales"
                                category="Sales per month"
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
                        <Col md={4}>
                            <Card
                                statsIcon="fa fa-clock-o"
                                title="Email Statistics"
                                category="Last Campaign Performance"
                                stats="Campaign sent 2 days ago"
                                content={
                                  <div id="chartPreferences" className="ct-chart ct-perfect-fourth">
                                    <ChartistGraph 
                                        data={dataPie} 
                                        type="Pie" 
                                    />
                                  </div>
                                }
                                legend={
                                  <div className="legend">{this.createLegend(legendPie)}</div>
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