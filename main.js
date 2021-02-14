let box_size = 20;
let grid;

function init() {
  grid = d3
    .select("#grid")
    .append("svg")
    .attr("width", "1000px")
    .attr("height", "1000px");
  draw();
}

window.onresize = function () {};

function draw() {
  let margin = 20;
  let warp_ends = 20;
  let shafts = 4;
  let treadles = 6;
  let pat_length = 20;

  // grid for threading
  drawGrid(margin, margin, shafts, warp_ends, "threading");

  // grid for tie up
  drawGrid(
    margin + box_size * warp_ends + margin,
    margin,
    shafts,
    treadles,
    "tieup"
  );

  //grid for treadling
  drawGrid(
    margin + box_size * warp_ends + margin,
    margin + box_size * shafts + margin,
    pat_length,
    treadles,
    "treadling"
  );

  //grid for fabric
  drawGrid(
    margin,
    margin + box_size * shafts + margin,
    pat_length,
    warp_ends,
    "fabric"
  );
}

function getRectColor(row_index, col_index) {
  return "#FFFFFF";
}

function drawGrid(start_x, start_y, row_num, col_num, name) {
  let data = new Array();
  for (let row_index = 0; row_index < row_num; row_index++) {
    data.push(new Array());
    for (let col_index = 0; col_index < col_num; col_index++) {
      let rect_x = start_x + col_index * box_size;
      let rect_y = start_y + row_index * box_size;
      data[row_index].push({
        x: rect_x,
        y: rect_y,
        width: box_size,
        height: box_size,
        click: 0,
      });
    }
  }

  let row = grid
    .selectAll("." + name)
    .data(data)
    .enter()
    .append("g")
    .attr("class", name);

  let column = row
    .selectAll(".square")
    .data(function (d) {
      return d;
    })
    .enter()
    .append("rect")
    .attr("class", "square")
    .attr("x", function (d) {
      return d.x;
    })
    .attr("y", function (d) {
      return d.y;
    })
    .attr("width", function (d) {
      return d.width;
    })
    .attr("height", function (d) {
      return d.height;
    })
    .style("fill", "#fff")
    .style("stroke", "#222")
    .on("click", function (d) {
      d.click++;
      if (d.click % 4 == 0) {
        d3.select(this).style("fill", "#fff");
      }
      if (d.click % 4 == 1) {
        d3.select(this).style("fill", "#2C93E8");
      }
      if (d.click % 4 == 2) {
        d3.select(this).style("fill", "#F56C4E");
      }
      if (d.click % 4 == 3) {
        d3.select(this).style("fill", "#838690");
      }
    });
}

function handleUserInput(a) {
  console.log(a);
}
