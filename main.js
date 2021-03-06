const zip = (a, b) => a.map((k, i) => [k, b[i]]);

let box_size = 20;
let grid;
let warp_ends = 20;
let shafts = 4;
let treadles = 6;
let pat_length = 20;
let state = {
  treadling: createArray(treadles, pat_length, false),
  threading: createArray(warp_ends, shafts, false),
  tie_up: createArray(treadles, shafts, false),
};

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
  d3.select("svg").selectAll("*").remove();
  let margin = 20;

  // grid for threading
  drawGrid(
    margin,
    margin,
    shafts,
    warp_ends,
    "threading",
    true,
    state.threading
  );

  // grid for tie up
  drawGrid(
    margin + box_size * warp_ends + margin,
    margin,
    shafts,
    treadles,
    "tieup",
    true,
    state.tie_up
  );

  //grid for treadling
  drawGrid(
    margin + box_size * warp_ends + margin,
    margin + box_size * shafts + margin,
    pat_length,
    treadles,
    "treadling",
    true,
    state.treadling
  );

  fabric = weave(state.treadling, state.threading, state.tie_up);
  console.log(fabric);

  //grid for fabric
  drawGrid(
    margin,
    margin + box_size * shafts + margin,
    pat_length,
    warp_ends,
    "fabric",
    false,
    fabric
  );
}

function getRectColor(row_index, col_index) {
  return "#FFFFFF";
}

function drawGrid(start_x, start_y, row_num, col_num, name, clickable, arr) {
  console.log(name);
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
        row_index: row_index,
        col_index: col_index,
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
    .style("fill", function (d) {
      if (arr) {
        console.log(name, arr[d.row_index][d.col_index]);
        if (arr[d.row_index][d.col_index]) {
          return "#838690";
        } else {
          return "#fff";
        }
      }
    })
    .style("stroke", "#222")
    .on("click", function (d) {
      if (clickable) {
        arr[d.row_index][d.col_index] ^= true;
        draw();
      }
    });
}

function handleUserInput(a) {
  console.log(a);
}

function createArray(x, y, item) {
  let arr = new Array(x);
  for (let i = 0; i < y; i++) {
    arr[i] = new Array(y);
    arr[i].fill(item);
  }
  return arr;
}

function weave(treadling, threading, tie_up) {
  fabric = createArray(threading[0].length, treadling.length, false);
  for (let i = 0; i < fabric.length; i++) {
    for (let j = 0; j < fabric[0].length; j++) {
      threading_state = threading.map((row) => row[j]);
      treadling_state = treadling[i];
      thread_shaft = threading_state.findIndex((element) => element);
      if (thread_shaft == -1) {
        fabric_state = false;
      } else {
        fabric_state = zip(tie_up[thread_shaft], treadling_state).some(
          (arr) => arr[0] && arr[1]
        );
      }
      fabric[i][j] = fabric_state;
    }
  }
  return fabric;
}
