import { h, Component, render } from "https://unpkg.com/preact?module";

/**
 * Creates a 2d array
 *
 * @param {number} x the number of inner arrays
 * @param {number} y the length of inner arrays
 * @param {any} item the item the inner arrays are initially filled with
 * @returns {any[][]}
 */
function create2dArray(x, y, item) {
  let arr = Array(x);
  for (let i = 0; i < x; i++) {
    arr[i] = Array(y).fill(item);
  }
  return arr;
}

/**
 * Creates the pattern of the woven fabric based on the treadling, threading,
 * and tie up.
 *
 * @param {number[]} treadling - treadling is an array with the same length as the
 * number of weft threads in the fabric, where each entry is the index of the treadle
 * which is engaged when weaving that thread. A value of undefined means that
 * no treadle is engaged, and we show that in the resultant fabric by having the
 * weft thread always be above the warp.
 *
 * @param {number[]} threading - threading is an array with the same length as the
 * number of warp threads in the fabric, where each entry is the index of the shaft
 * that the thread is threaded through. A value of undefined means that the thread
 * goes through none of the shafts, and by we show that in the resultant fabric
 * by having the warp thread always be below the weft.
 *
 * @param {boolean[][]} tie_up - tie_up is a 2d array of booleans. When indexed with
 * the index of a treadle and then the index of a shaft, the boolean stored indicates
 * whether or not that treadle is tied to that shaft.
 *
 * @returns {boolean[][]} the resultant fabric, a 2d array of booleans. When indexed
 * with the index of a warp thread and then the index of a weft thread, the boolean
 * stored indicates whether or not the warp thread is above the weft thread.
 */
function weave(treadling, threading, tie_up) {
  let fabric = create2dArray(threading.length, treadling.length, false);
  for (let warp_thread = 0; warp_thread < threading.length; warp_thread++) {
    let shaft = threading[warp_thread];
    if (shaft == undefined) {
      fabric[warp_thread].fill(false);
    } else {
      for (let weft_thread = 0; weft_thread < treadling.length; weft_thread++) {
        let treadle = treadling[weft_thread];
        if (treadle == undefined) {
          fabric[warp_thread][weft_thread] = false;
        } else {
          fabric[warp_thread][weft_thread] = tie_up[treadle][shaft];
        }
      }
    }
  }
  return fabric;
}

function Square(props) {
  return h("rect", {
    width: props.box_size,
    height: props.box_size,
    x: props.x_loc,
    y: props.y_loc,
    style: { fill: props.getColor(props.x, props.y), stroke: "#222" },
    onClick: () => props.click(props.x, props.y),
  });
}

function Grid(props) {
  let data = [];
  for (let row_index = 0; row_index < props.row_num; row_index++) {
    for (let col_index = 0; col_index < props.col_num; col_index++) {
      let rect_x = props.start_x + col_index * props.box_size;
      let rect_y = props.start_y + row_index * props.box_size;
      data.push(
        h(Square, {
          x_loc: rect_x,
          y_loc: rect_y,
          x: col_index,
          y: row_index,
          box_size: props.box_size,
          ...props.square_props,
        })
      );
    }
  }
  return h("g", {}, data);
}

function Threading(props) {
  let start_x = props.margin;
  let start_y = props.margin;

  return h(Grid, {
    start_x: start_x,
    start_y: start_y,
    box_size: props.box_size,
    row_num: props.shafts,
    col_num: props.warp_ends,
    square_props: {
      getColor: (x, y) => (props.threading[x] == y ? "#222" : "#fff"),
      click: (x, y) => {
        props.thread(x, y);
      },
    },
  });
}

function Treadling(props) {
  let start_x =
    // Fabric
    props.margin +
    props.box_size * props.warp_ends +
    // WeftColors
    props.margin +
    props.box_size +
    // margin
    props.margin;
  let start_y =
    // Threading
    props.margin +
    props.box_size * props.shafts +
    // WarpColors
    props.margin +
    props.box_size +
    // margin
    props.margin;

  return h(Grid, {
    start_x: start_x,
    start_y: start_y,
    box_size: props.box_size,
    row_num: props.pat_length,
    col_num: props.treadles,
    square_props: {
      getColor: (x, y) => (props.treadling[y] == x ? "#222" : "#fff"),
      click: (x, y) => {
        props.treadle(y, x);
      },
    },
  });
}

function TieUp(props) {
  let start_x =
    // Fabric
    props.margin +
    props.box_size * props.warp_ends +
    // WeftColors
    props.margin +
    props.box_size +
    // margin
    props.margin;
  let start_y = props.margin;

  return h(Grid, {
    start_x: start_x,
    start_y: start_y,
    box_size: props.box_size,
    row_num: props.shafts,
    col_num: props.treadles,
    square_props: {
      getColor: (x, y) => (props.tie_up[x][y] ? "#222" : "#fff"),
      click: (x, y) => {
        props.tie(x, y);
      },
    },
  });
}

function WarpColors(props) {
  let start_x = props.margin;
  let start_y = props.margin + props.box_size * props.shafts + props.margin;

  return h(Grid, {
    start_x: start_x,
    start_y: start_y,
    box_size: props.box_size,
    row_num: 1,
    col_num: props.warp_ends,
    square_props: {
      getColor: (x, _) => props.palette[props.warp_colors[x]],
      click: (x, _) => props.color_warp(x),
    },
  });
}

function WeftColors(props) {
  let start_x = props.margin + props.box_size * props.warp_ends + props.margin;
  let start_y =
    // Threading
    props.margin +
    props.box_size * props.shafts +
    // WarpColors
    props.margin +
    props.box_size +
    // margin
    props.margin;

  return h(Grid, {
    start_x: start_x,
    start_y: start_y,
    box_size: props.box_size,
    row_num: props.pat_length,
    col_num: 1,
    square_props: {
      getColor: (_, y) => props.palette[props.weft_colors[y]],
      click: (_, y) => props.color_weft(y),
    },
  });
}

function Fabric(props) {
  let start_x = props.margin;
  let start_y =
    // Threading
    props.margin +
    props.box_size * props.shafts +
    // WarpColors
    props.margin +
    props.box_size +
    // margin
    props.margin;

  return h(Grid, {
    start_x: start_x,
    start_y: start_y,
    box_size: props.box_size,
    row_num: props.pat_length,
    col_num: props.warp_ends,
    square_props: {
      getColor: (x, y) =>
        props.fabric[x][y]
          ? props.palette[props.warp_colors[x]]
          : props.palette[props.weft_colors[y]],
      // nothing happens when you click on the fabric
      click: () => {},
    },
  });
}

/** Top level component for weaving grid */
class Weaver extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // For threading and treadling, we have an array of values that indicate
      // which shaft or treadle is engaged. undefined means there is no engaged
      // shaft or treadle.
      treadling: Array(props.pat_length).fill(undefined),
      threading: Array(props.warp_ends).fill(undefined),
      tie_up: create2dArray(props.treadles, props.shafts, false),
      weft_colors: Array(props.pat_length).fill(0),
      warp_colors: Array(props.warp_ends).fill(1),
      palette: props.palette,
    };
  }

  /** engages (or disengages) the treadle at given location */
  treadle(weft_location, treadle_pushed) {
    this.setState((state, _) => {
      let new_treadling = [...state.treadling];
      if (state.treadling[weft_location] == treadle_pushed) {
        new_treadling[weft_location] = undefined;
      } else {
        new_treadling[weft_location] = treadle_pushed;
      }
      return {
        treadling: new_treadling,
      };
    });
  }

  /** threads (or unthreads) the warp yarn at a given shaft */
  thread(warp_location, shaft_threaded) {
    this.setState((state, _) => {
      let new_threading = [...state.threading];
      if (state.threading[warp_location] == shaft_threaded) {
        new_threading[warp_location] = undefined;
      } else {
        new_threading[warp_location] = shaft_threaded;
      }
      return {
        threading: new_threading,
      };
    });
  }

  /** changes the color of the indicated warp thread */
  color_warp(warp_location) {
    this.setState((state, _) => {
      let new_warp_colors = [...state.warp_colors];
      new_warp_colors[warp_location] =
        (state.warp_colors[warp_location] + 1) % state.palette.length;
      return {
        warp_colors: new_warp_colors,
      };
    });
  }

  /** changes the color of the indicated warp thread */
  color_weft(weft_location) {
    this.setState((state, _) => {
      let new_weft_colors = [...state.weft_colors];
      new_weft_colors[weft_location] =
        (state.weft_colors[weft_location] + 1) % state.palette.length;
      return {
        weft_colors: new_weft_colors,
      };
    });
  }

  /** ties the given treadle to the given shaft */
  tie(treadle, shaft) {
    this.setState((state, _) => {
      let new_tie_up = Array.from(state.tie_up, (arr) => [...arr]);
      new_tie_up[treadle][shaft] = !state.tie_up[treadle][shaft];
      return {
        tie_up: new_tie_up,
      };
    });
  }

  render() {
    let sub_props = { margin: 20, box_size: 20, ...this.props };

    return h(
      "svg",
      { width: 1000, height: 1000 },
      h(Threading, {
        thread: (warp, shaft) => this.thread(warp, shaft),
        threading: this.state.threading,
        ...sub_props,
      }),
      h(WarpColors, {
        warp_colors: this.state.warp_colors,
        color_warp: (x) => this.color_warp(x),
        ...sub_props,
      }),
      h(Treadling, {
        treadle: (weft, treadle) => this.treadle(weft, treadle),
        treadling: this.state.treadling,
        ...sub_props,
      }),
      h(WeftColors, {
        weft_colors: this.state.weft_colors,
        color_weft: (x) => this.color_weft(x),
        ...sub_props,
      }),
      h(TieUp, {
        tie: (shaft, treadle) => this.tie(shaft, treadle),
        tie_up: this.state.tie_up,
        ...sub_props,
      }),
      h(Fabric, {
        fabric: weave(
          this.state.treadling,
          this.state.threading,
          this.state.tie_up
        ),
        warp_colors: this.state.warp_colors,
        weft_colors: this.state.weft_colors,
        ...sub_props,
      })
    );
  }
}

render(
  h(Weaver, {
    warp_ends: 20,
    shafts: 4,
    treadles: 6,
    pat_length: 20,
    palette: ["#466365", "#B49A67", "#CEB3AB", "#C4C6E7", "#BAA5FF"],
  }),
  document.body
);
