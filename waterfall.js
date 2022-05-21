class Waterfall {
  constructor(el, minWidth, styles) {
    this.box = el;
    this.items = [...el.children];
    this.minWidth = minWidth;
    this.styles = styles;
    this.init();
  }

  init() {
    this.sortItems();
    this.hideItems();
    this.addStyles();
    this.render();
    this.setBrowserVisibilityParams();
    this.addListeners();
  }

  addStyles() {
    this.box.classList.add(".waterfall__container");
    const style = document.createElement("style");
    style.innerHTML = `
      .waterfall__container {
        display: flex;
        flex-wrap: nowrap;
        justify-content: center;
        align-items: flex-start;
      }
      .waterfall__col {
        flex: 1;
      }
      ${this.styles}
    `;
    document.body.insertAdjacentElement("beforeend", style);
  }

  render = () => {    
    this.removeCols();
    this.addCols();
    this.spreadItems();
  };

  sortItems() {
    this.items.sort((a, b) => {
      return a.offsetHeight - b.offsetHeight > 0 ? -1 : 1;
    });
  }

  hideItems() {
    this.items.forEach((item) => item.remove());
  }

  removeCols() {
    [...this.box.querySelectorAll(".waterfall__col")].forEach((col) =>
      col.remove()
    );
  }

  addCols() {
    const screenWidth = document.body.clientWidth;
    const cols = Math.ceil(screenWidth / this.minWidth);

    for (let i = 0; i < cols; i++) {
      this.addCol(i + 1);
    }

    this.cols = [...this.box.querySelectorAll(".waterfall__col")];
  }

  addCol(id) {
    const col = document.createElement("div");
    col.classList.add("waterfall__col");
    col.dataset.colOrder = id;
    this.box.insertAdjacentElement("beforeend", col);
  }

  spreadItems() {
    this.items.forEach((item) => {
      const col = this.findSmallestCol();
      col.insertAdjacentElement("beforeend", item);
    });
  }

  findSmallestCol() {
    const firstCol = {
      index: 0,
      height: this.cols[0].offsetHeight,
    };

    const smallest = this.cols.reduce((acc, col, index) => {
      const colHeight = col.offsetHeight;

      if (colHeight < acc.height) {
        return {
          index,
          height: colHeight,
        };
      }

      return acc;
    }, firstCol);

    return this.cols[smallest.index];
  }

  setBrowserVisibilityParams() {
    let hidden, visibilityChange;
    if (typeof document.hidden !== "undefined") {
      // Opera 12.10 and Firefox 18 and later support
      hidden = "hidden";
      visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
      hidden = "msHidden";
      visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
      hidden = "webkitHidden";
      visibilityChange = "webkitvisibilitychange";
    }

    this.hidden = hidden;
    this.visibilityChange = visibilityChange;
  }

  addListeners() {
    window.addEventListener("resize", this.render);
    document.addEventListener(this.visibilityChange, this.render);
  }

  remove() {
    window.removeEventListener("resize", this.render);
    document.removeEventListener(this.visibilityChange, this.render);
  }
}

window.waterfall = (selector, minWidth, styles) => {
  window.addEventListener("load", () => {
    const el = document.querySelector(selector);
    new Waterfall(el, minWidth, styles);
  });
};

const styles = `
  .waterfall__col:not(:last-of-type) {
    margin-right: 10px;
  }
`;

waterfall(".waterfall__container", 500, styles);
