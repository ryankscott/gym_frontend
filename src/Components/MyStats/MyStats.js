import PropTypes from "prop-types";
import React, { Component } from "react";
import styles from "./MyStats.css";
import { Doughnut, Line } from "react-chartjs-2";
import moment from "moment";
import { defaults } from "react-chartjs-2";

defaults.global.defaultFontFamily = "Lato";
defaults.global.defaultColour = "#5BC0EB";

const colours = [
  "#35a7ff",
  "#3198e8",
  "#47afff",
  "#2c89d1",
  "#59b7ff",
  "#277aba",
  "#6cbfff",
  "#226ba3"
];

const lineChartOptions = {
  legend: {
    display: false,
    labels: {
      fontSize: 10
    }
  },
  scales: {
    yAxes: [
      {
        ticks: {
          max: 7,
          min: 0,
          stepSize: 1
        }
      }
    ]
  },
  layout: {
    padding: 20
  }
};

const donutChartOptions = {
  legend: {
    display: true,
    position: "right"
  },
  labels: {
    fontSize: 12
  },
  layout: {
    padding: 20
  }
};

class MyStats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stats: null
    };
    this.getStats = this.getStats.bind(this);
    this.getStats();
  }

  getStats() {
    var url = __GYMCLASS_URL__ + "/stats/";
    fetch(url, {
      method: "GET",
      headers: { Authorization: "Bearer " + localStorage.getItem("id_token") },
      mode: "cors"
    })
      .then(function(response) {
        if (!response.ok) {
        }
        return response.json();
      })
      .then(
        function(res) {
          this.setState({ stats: res });
        }.bind(this)
      )
      .catch(function(err) {
        console.log(err);
      });
  }

  parseClassPreferenceData() {
    if (this.state.stats) {
      var classData = this.state.stats.classPreferences;
      var labels = [];
      var data = [];
      for (var index = 0; index < classData.length; index++) {
        labels.push(classData[index].class);
        data.push(classData[index].preference * 100);
      }
      var chartData = {
        labels: labels,
        datasets: [
          {
            backgroundColor: colours,
            data: data
          }
        ]
      };
      return chartData;
    } else {
      return {};
    }
  }

  parseWorkOutFrequencyData() {
    if (this.state.stats) {
      var classData = this.state.stats.workOutFrequency;
      var labels = [];
      var data = [];
      for (var index = 0; index < classData.length; index++) {
        labels.push(
          moment()
            .day("Monday")
            .week(classData[index].week)
            .format("DD/MM/YYYY")
        );
        data.push(classData[index].count);
      }
      var chartData = {
        labels: labels,
        datasets: [
          {
            data: data,
            fill: false,
            pointBorderColor: colours[0],
            pointBackgroundColor: colours[1],
            borderColor: colours[2]
          }
        ]
      };
      return chartData;
    } else {
      return {};
    }
  }

  parseGymPreferenceData() {
    if (this.state.stats) {
      var gymData = this.state.stats.gymPreferences;
      var labels = [];
      var data = [];
      for (var index = 0; index < gymData.length; index++) {
        labels.push(gymData[index].gym.Name.toUpperCase());
        data.push(gymData[index].preference * 100);
      }
      var chartData = {
        labels: labels,
        datasets: [
          {
            backgroundColor: colours,
            data: data
          }
        ]
      };
      return chartData;
    } else {
      return {};
    }
  }

  render() {
    var daysSinceLastClass = this.state.stats
      ? moment().diff(moment(this.state.stats.lastClassDate), "days")
      : 0;
    return (
      <div className={styles.container}>
        <h1 className={styles.h1}> Your Stats </h1>
        <div className={styles.allChartsContainer}>
          <div className={styles.chartContainer}>
            <h2 className={styles.h2}> Class stats </h2>
            <div className={styles.chartTextContainer}>
              <div className={styles.charText}>
                <div className={styles.statValue}>
                  {this.state.stats ? this.state.stats.totalClasses : 0}
                </div>
                <div className={styles.statName}>Total Classes</div>
              </div>

              <div className={styles.chartText}>
                <div className={styles.statValue}>
                  {this.state.stats
                    ? this.state.stats.classesPerWeek.toFixed(2)
                    : 0.0}
                </div>
                <div className={styles.statName}>Classes per week</div>
              </div>

              <div className={styles.chartText}>
                <div className={styles.statValue}>
                  {daysSinceLastClass < 0 ? 0 : daysSinceLastClass}
                </div>
                <div className={styles.statName}>Days since last class</div>
              </div>
            </div>
          </div>

          <div className={styles.chartContainer}>
            <h2 className={styles.h2}> Class Preference </h2>
            <Doughnut
              height={25}
              width={50}
              options={donutChartOptions}
              data={this.parseClassPreferenceData()}
            />
          </div>

          <div className={styles.chartContainer}>
            <h2 className={styles.h2}> Gym Preference </h2>
            <Doughnut
              height={25}
              width={50}
              options={donutChartOptions}
              data={this.parseGymPreferenceData()}
            />
          </div>

          <div className={styles.chartContainer}>
            <h2 className={styles.h2}> Weekly Frequency </h2>
            <Line
              height={30}
              width={60}
              options={lineChartOptions}
              data={this.parseWorkOutFrequencyData()}
            />
          </div>
        </div>
      </div>
    );
  }
}

MyStats.propTypes = {};

export default MyStats;
