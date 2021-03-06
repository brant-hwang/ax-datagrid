import * as React from 'react';
import classNames from 'classnames';
import { iGridScroll } from '../_inc/namespaces';

export class GridScroll extends React.Component<iGridScroll.Props, iGridScroll.State> {
  constructor(props: iGridScroll.Props) {
    super(props);

    this.onClickScrollTrack = this.onClickScrollTrack.bind(this);
  }

  /*
  // 사실상 항상 리랜더 해야 하는 컴포넌트라서 제어하지 않을 작정
    shouldComponentUpdate(nextProps, nextState) {
      let sameProps = false;

      for(const k in this.props){
        if(typeof nextProps[k] === 'undefined' || nextProps[k] !== this.props[k]){
          sameProps = true;
        }
      }

      return sameProps;
    }
  */

  public onClickScrollTrack(e, barName) {
    e.preventDefault();
    if (e.target.getAttribute('data-scroll')) {
      this.props.onClickScrollTrack(e, barName);
    }
  }

  public render() {

    const {
      mounted,
      gridCSS,
      bodyHeight,
      pageHeight,
      verticalScrollerHeight,
      verticalScrollerWidth,
      horizontalScrollerWidth,
      horizontalScrollerHeight,
      verticalScrollBarHeight,
      horizontalScrollBarWidth,
      scrollerArrowSize,
      scrollerPadding,
      scrollBarLeft,
      scrollBarTop,
      refCallback,
      onMouseDownScrollBar,
      onClickScrollArrow,
    } = this.props;

    if (!mounted) return null;

    if (verticalScrollerWidth === 0 && horizontalScrollerHeight === 0) return null;

    let verticalArrowStyles = {
      width: verticalScrollerWidth,
      height: scrollerArrowSize / 2 + scrollerPadding
    };

    let arrowWidth = (verticalScrollerWidth - scrollerPadding * 2) / 2;
    let verticalTopArrowStyles = {
      left: scrollerPadding,
      top: (verticalArrowStyles.height - arrowWidth) / 2,
      borderTop: '0 none',
      borderRight: 'solid ' + arrowWidth + 'px transparent',
      borderBottomWidth: (arrowWidth) + 'px',
      borderLeft: 'solid ' + arrowWidth + 'px transparent'
    };
    let verticalBottomArrowStyles = {
      left: scrollerPadding,
      top: (verticalArrowStyles.height - arrowWidth) / 2,
      borderTopWidth: (arrowWidth) + 'px',
      borderRight: 'solid ' + arrowWidth + 'px transparent',
      borderBottom: '0 none',
      borderLeft: 'solid ' + arrowWidth + 'px transparent'
    };
    let verticalStyles = {
      width: verticalScrollerWidth,
      height: verticalScrollerHeight + scrollerPadding * 2 + scrollerArrowSize,
      bottom: pageHeight,
      padding: scrollerPadding,
      paddingTop: scrollerArrowSize / 2 + scrollerPadding
    };
    let verticalBarStyles = {
      height: verticalScrollBarHeight,
      top: scrollBarTop
    };

    let horizontalArrowStyles = {
      width: scrollerArrowSize / 2 + scrollerPadding,
      height: horizontalScrollerHeight
    };

    let horizontalLeftArrowStyles = {
      left: (horizontalArrowStyles.width - arrowWidth) / 2,
      top: scrollerPadding,
      borderTop: 'solid ' + arrowWidth + 'px transparent',
      borderRightWidth: (arrowWidth) + 'px',
      borderBottom: 'solid ' + arrowWidth + 'px transparent',
      borderLeft: '0 none'
    };
    let horizontalRightArrowStyles = {
      left: (horizontalArrowStyles.width - arrowWidth) / 2,
      top: scrollerPadding,
      borderTop: 'solid ' + arrowWidth + 'px transparent',
      borderRight: '0 none',
      borderBottom: 'solid ' + arrowWidth + 'px transparent',
      borderLeftWidth: (arrowWidth) + 'px'
    };
    let horizontalStyles = {
      width: horizontalScrollerWidth + scrollerPadding * 2 + scrollerArrowSize,
      height: horizontalScrollerHeight,
      bottom: (pageHeight - 1 - horizontalScrollerHeight) / 2,
      right: (pageHeight - 1 - horizontalScrollerHeight) / 2,
      padding: scrollerPadding,
      paddingLeft: scrollerArrowSize / 2 + scrollerPadding
    };
    let horizontalBarStyles = {
      width: horizontalScrollBarWidth,
      left: scrollBarLeft
    };

    return (
      <div className={classNames(gridCSS.scroller)}>
        {(verticalScrollerWidth) ? (
          <div data-scroll-track='vertical' style={verticalStyles}>
            <div data-scroll-arrow='up' style={verticalArrowStyles}>
              <div data-arrow style={verticalTopArrowStyles} onClick={e => onClickScrollArrow(e, 'up')} />
            </div>
            <div data-scroll='vertical'
                 ref={ref => refCallback('vertical-scroll-track', ref)}
                 onClick={e => this.onClickScrollTrack(e, 'vertical')}>
              <div className={classNames(gridCSS.scrollBar)}
                   style={verticalBarStyles}
                   onMouseDown={e => onMouseDownScrollBar(e, 'vertical')} />
            </div>
            <div data-scroll-arrow='down' style={verticalArrowStyles}>
              <div data-arrow style={verticalBottomArrowStyles} onClick={e => onClickScrollArrow(e, 'down')} />
            </div>
          </div>
        ) : null}
        {(horizontalScrollerHeight) ? (
          <div data-scroll-track='horizontal' style={horizontalStyles}>
            <div data-scroll-arrow='left' style={horizontalArrowStyles}>
              <div data-arrow style={horizontalLeftArrowStyles} onClick={e => onClickScrollArrow(e, 'left')} />
            </div>
            <div data-scroll='horizontal'
                 ref={ref => refCallback('horizontal-scroll-track', ref)}
                 onClick={e => this.onClickScrollTrack(e, 'horizontal')}>
              <div className={classNames(gridCSS.scrollBar)}
                   style={horizontalBarStyles}
                   onMouseDown={(e) => onMouseDownScrollBar(e, 'horizontal')} />
            </div>
            <div data-scroll-arrow='right' style={horizontalArrowStyles}>
              <div data-arrow style={horizontalRightArrowStyles} onClick={e => onClickScrollArrow(e, 'right')} />
            </div>
          </div>
        ) : null}
      </div>
    );

  }
}
