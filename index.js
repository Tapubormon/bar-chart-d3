const dataset = fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
)
  .then((res) => res.json())
  .then((data) => {
    const width = 900;
    const height = 550;
    const padding = 60;

    const barWidth = (width - 2 * padding) / data.data.length;

    const svg = d3
      .select("body")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("background", "#f0f0f0");

    svg
      .append("text")
      .attr("id", "title")
      .attr("x", 280)
      .attr("y", 50)
      .attr("font-size", "38px")
      .attr("fill", "black")
      .text("United States GDP");

    const parseTime = d3.utcParse("%Y-%m-%d");

    const xScale = d3
      .scaleTime()
      .domain([
        d3.min(data.data, (d) => parseTime(d[0])),
        d3.max(data.data, (d) => parseTime(d[0])),
      ])
      .range([padding, width - padding]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data.data, (d) => d[1])])
      .range([height - padding, padding]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"));
    const yAxis = d3.axisLeft(yScale);

    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height - padding})`)
      .call(xAxis);

    svg
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${padding}, 0)`)
      .call(yAxis);

    d3.selectAll("#x-axis .tick").attr("class", "tick");
    d3.selectAll("#y-axis .tick").attr("class", "tick");

    const tooltip = d3.select("#tooltip");

    svg
      .selectAll("rect")
      .data(data.data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(parseTime(d[0])) - barWidth / 2)
      .attr("y", (d) => yScale(d[1]))
      .attr("width", barWidth)
      .attr("height", (d) => height - padding - yScale(d[1]))
      .attr("fill", "steelblue")
      .attr("data-date", (d) => d[0])
      .attr("data-gdp", (d) => d[1])
      .on("mouseover", function (event, d) {
        d3.select(this).attr("fill", "orange"); // 🔸 Highlight bar

        tooltip
          .style("opacity", 0.9)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px")
          .attr("data-date", d[0])
          .html(
            `<strong>Date:</strong> ${
              d[0]
            }<br><strong>GDP:</strong> $${d[1].toFixed(1)} Billion`
          );
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", "steelblue"); // 🔵 Reset color

        tooltip.style("opacity", 0);
      });

    console.log(data);
  });
