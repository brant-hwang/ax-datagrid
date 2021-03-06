import * as React from 'react';
import * as UTIL from '../_inc/utils';
import classNames from 'classnames'
import { iGridHeader } from '../_inc/namespaces';


export class GridHeader extends React.Component<iGridHeader.Props, iGridHeader.State> {
  constructor(props: iGridHeader.Props) {
    super(props);

    this.state = {};
    this.onMouseDownColumnResizer = this.onMouseDownColumnResizer.bind(this);
  }

  public shouldComponentUpdate(nextProps, nextState) {
    let sameProps = false;

    if (
      this.props.mounted !== nextProps.mounted ||
      JSON.stringify(this.props.optionsHeader) !== JSON.stringify(nextProps.optionsHeader) ||
      JSON.stringify(this.props.styles) !== JSON.stringify(nextProps.styles) ||
      JSON.stringify(this.props.headerColGroup) !== JSON.stringify(nextProps.headerColGroup) ||
      this.props.scrollLeft !== nextProps.scrollLeft
    ) {
      sameProps = true;
    }

    return sameProps;
  }

  private onMouseDownColumnResizer(e, col) {
    e.preventDefault();

    const resizer = e.target;
    const prevLeft = Number(resizer.getAttribute('data-prev-left'));
    const currLeft = Number(resizer.getAttribute('data-left'));
    let newWidth;
    let startMousePosition = UTIL.getMousePosition(e).x;

    const onMouseMove = (ee) => {
      const {x, y} = UTIL.getMousePosition(ee);
      let newLeft = currLeft + x - startMousePosition;
      if (newLeft < prevLeft) {
        newLeft = prevLeft;
      }

      resizer.style.left = (newLeft - 2) + 'px';
      newWidth = newLeft - prevLeft;
    };

    const offEvent = (ee) => {
      ee.preventDefault();
      startMousePosition = null;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', offEvent);
      document.removeEventListener('mouseleave', offEvent);

      // console.log(newWidth);
      this.props.onResizeColumnResizer(e, col, newWidth);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', offEvent);
    document.addEventListener('mouseleave', offEvent);
  }

  private printHeader(_panelName : string, _colGroup : any, _bodyRow : any, _style : object) {
    const onMouseDownColumnResizer = this.onMouseDownColumnResizer;
    const {refCallback, optionsHeader, gridCSS} = this.props;

    const getFieldSpan = function (_colGroup, _col) {
      let lineHeight = (optionsHeader.columnHeight - optionsHeader.columnPadding * 2 - optionsHeader.columnBorderWidth);
      let colAlign = optionsHeader.align || _col.align;
      let label, sorter, filter;

      if (_col.key === '__checkbox_header__') {
        if (optionsHeader.selector) {
          label = <div data-checkbox style={{
            maxHeight: (_col.width - 10) + 'px',
            minHeight: (_col.width - 10) + 'px'
          }} />;
        }
      } else {
        label = _col.label;
      }

      if (_col.key && _col.colIndex !== null && typeof _col.colIndex !== 'undefined' && (optionsHeader.sortable === true || _col.sortable === true) && _col.sortable !== false) {
        sorter = <span data-sorter={_col.colIndex} data-sorter-order={_colGroup[_col.colIndex].sort} />;
      }

      if (_col.colIndex !== null && typeof _col.colIndex !== 'undefined' && optionsHeader.enableFilter) {
        filter = <span data-filter={_col.colIndex} data-filter-value='' />;
      }

      return (
        <span
          data-span
          data-align={colAlign}
          style={{
            height: (optionsHeader.columnHeight - optionsHeader.columnBorderWidth) + 'px',
            lineHeight: lineHeight + 'px'
          }}>
          {sorter}
          {label || ' '}
          {filter}
        </span>
      );
    };

    return (
      <div data-panel={_panelName} style={_style} ref={ref => refCallback(_panelName, ref)}>
        <table style={{height: '100%'}}>
          <colgroup>
            {_colGroup.map(
              (col, ci) => (
                <col
                  key={ci}
                  style={{width: col._width + 'px'}} />
              )
            )}
            <col />
          </colgroup>
          <tbody>
          {_bodyRow.rows.map(
            (row, ri) => {
              return (
                <tr
                  key={ri}
                  className=''>
                  {row.cols.map((col, ci) => {
                    let cellHeight = optionsHeader.columnHeight * col.rowspan - optionsHeader.columnBorderWidth;
                    let classNameItems = {
                      [gridCSS.hasBorder]: true,
                      [gridCSS.headerColumn]: true,
                      [gridCSS.headerCorner]: (col.columnAttr === 'lineNumber')
                    };

                    return (
                      <td
                        key={ci}
                        colSpan={col.colspan}
                        rowSpan={col.rowspan}
                        className={classNames(classNameItems)}
                        style={{height: cellHeight, minHeight: '1px'}}>
                        {getFieldSpan(_colGroup, col)}
                      </td>
                    );
                  })}
                  <td>&nbsp;</td>
                </tr>
              );
            }
          )}
          </tbody>
        </table>

        {(() => {
          let resizerHeight = optionsHeader.columnHeight * _bodyRow.rows.length - optionsHeader.columnBorderWidth;
          let resizer, resizerLeft = 0, resizerWidth = 4;
          return _colGroup.map(
            (col, ci) => {
              if (col.colIndex !== null && typeof col.colIndex !== 'undefined') {
                let prevResizerLeft = resizerLeft;
                resizerLeft += col._width;
                resizer = <div
                  key={ci}
                  data-column-resizer={col.colIndex}
                  data-prev-left={prevResizerLeft}
                  data-left={resizerLeft}
                  style={{width: resizerWidth, height: resizerHeight + 'px', left: (resizerLeft - resizerWidth / 2) + 'px'}}
                  onMouseDown={e => onMouseDownColumnResizer(e, col)}
                />;
              }
              return (resizer);
            }
          )
        })()}
      </div>
    );
  }

  public render() {

    const {
      gridCSS,
      refCallback,
      mounted,
      optionsHeader,
      styles,
      frozenColumnIndex,
      colGroup,
      asideColGroup,
      leftHeaderColGroup,
      headerColGroup,
      asideHeaderData,
      leftHeaderData,
      headerData,
      scrollLeft
    } = this.props;

    if (!mounted) return null;

    let asideHeaderPanelStyle = {
      left: 0,
      width: styles.asidePanelWidth,
      height: styles.headerHeight
    };
    let leftHeaderPanelStyle = {
      left: styles.asidePanelWidth,
      width: styles.frozenPanelWidth,
      height: styles.headerHeight
    };
    let headerPanelStyle = {
      left: styles.frozenPanelWidth + styles.asidePanelWidth,
      width: styles.CTInnerWidth - styles.asidePanelWidth - styles.frozenPanelWidth - styles.rightPanelWidth,
      height: styles.headerHeight
    };
    let headerScrollStyle = {
      height: styles.headerHeight,
      left: scrollLeft
    };

    return (
      <div className={classNames(gridCSS.header)} style={{height: styles.headerHeight}}>
        {(styles.asidePanelWidth > 0) ? this.printHeader('aside-header', asideColGroup, asideHeaderData, asideHeaderPanelStyle) : null}
        {(frozenColumnIndex > 0) ? this.printHeader('left-header', leftHeaderColGroup, leftHeaderData, leftHeaderPanelStyle) : null}
        <div data-scroll-container='header-scroll-container' style={headerPanelStyle}>
          {this.printHeader('header-scroll', headerColGroup, headerData, headerScrollStyle)}
        </div>
      </div>
    )
  }
};