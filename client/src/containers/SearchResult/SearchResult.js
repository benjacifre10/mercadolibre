import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

import classes from './SearchResult.module.sass';
import Backdrop from '../../components/UI/Backdrop/Backdrop';
import Notification, { toastOptions } from '../../components/UI/Notification/Notification';
import SearchBox from '../SearchBox/SearchBox';
import imageShipping from '../../assets/images/ic_shipping@2x.png.png';

import * as actions from '../../store/actions/index';

class SearchResult extends Component {

    componentDidMount() {
        this.getResults();
    }

    componentDidUpdate() {
        if (this.props.error) {
            this.props.onProductsResetError();
        }
        if (this.props.query) {
            const params = new URLSearchParams(this.props.location.search);
            for (let param of params.entries()) {
                if (param[0] === 'search') {
                    if (param[1] !== this.props.query.q) {
                        this.getResults();
                    }
                    break;
                }
            }
        }
    }

    getResults = () => {
        this.props.onProductsClean();
        const params = new URLSearchParams(this.props.location.search);
        for (let param of params.entries()) {
            if (param[0] === 'search') {
                let query = {
                    q: param[1]
                };
                this.props.onProductsGetList(query, this.props.serverURL);
                break;
            }
        }
    }

    itemSelectedHandler = id => {
        this.props.history.push({ pathname: `/items/${id}` });
    }

    searchChangedHandler = search => {
        if (!search) {
            this.props.history.push({ pathname: '/' });
        } else {
            const params = new URLSearchParams(this.props.location.search);
            for (let param of params.entries()) {
                if (param[0] === 'search') {
                    if (param[1] !== search) {
                        this.props.history.push({ pathname: '/items', search: `?search=${search}` });
                        let query = {
                            q: search
                        };
                        this.props.onProductsGetList(query, this.props.serverURL);
                    }
                    break;
                }
            }
        }
    }

    render() {
        let categories = null;
        if (this.props.data) {
            categories = this.props.data.categories.map((item, index) => {
                if (index < this.props.data.categories.length - 1) {
                    return (
                        <Fragment key={index + ',' + item}>
                            <span className={classes.PathFromRoot}>{this.props.data.categories[index]}</span>
                            <FontAwesomeIcon className={classes.Separator} icon={faChevronRight} />
                        </Fragment>
                    );
                } else {
                    return (
                        <Fragment key={index + ',' + item}>
                            <span className={classes.EndOfPathFromRoot}>{this.props.data.categories[index]}</span>
                        </Fragment>
                    );
                }
            });
        }

        let products = [];
        for (let i = 0; i < 3; i++) {
            products.push(
                <Fragment key={i}>
                    <article className={classes.Article}></article>
                    <div className={classes.Divider}></div>
                </Fragment>
            );
        }
        products.push(
            <Fragment key={3}>
                <article className={classes.Article}></article>
            </Fragment>
        );

        if (this.props.data) {
            products = this.props.data.items.map((item, index) => {
                let decimals = item.price.decimals;
                return (
                    <Fragment key={index + ',' + item.id}>
                        <article className={classes.Article}>
                            <div className={classes.PictureContainer} onClick={() => this.itemSelectedHandler(item.id)}>
                                <img className={classes.Picture} src={item.picture} alt="Producto" draggable="false" />
                            </div>
                            <div className={classes.PriceContainer}>
                                <div className={classes.Currency}>{item.price.currency}</div>
                                <div className={classes.Amount}>{item.price.amount.toLocaleString('es')}</div>
                                <div className={classes.Decimals}>{decimals < 10 ? '0' + decimals : decimals}</div>
                                {item.free_shipping ?
                                    <img className={classes.FreeShipping} src={imageShipping} alt="Envío Gratis" draggable="false" /> : null}
                            </div>
                            <div className={classes.Title} onClick={() => this.itemSelectedHandler(item.id)}>{item.title}</div>
                            <div className={classes.Address}>{item.state}</div>
                        </article>
                        {this.props.data.items.length > 3 && index < 3 ? <div className={classes.Divider}></div> : null}
                    </Fragment>
                );
            });
        }

        let search = '';
        const params = new URLSearchParams(this.props.location.search);
        for (let param of params.entries()) {
            if (param[0] === 'search') {
                search = param[1];
                break;
              }
        }

        if (this.props.error) {
            toast.dismiss();
            toast.error(<Notification toastType="error" title="Error" message={this.props.error.message} />, toastOptions);
        }

        return (
            <Fragment>
                <Backdrop show={this.props.loading} clicked={() => { }} />
                <SearchBox
                    search={search}
                    changed={this.searchChangedHandler} />
                <div className={classes.SearchResult}>
                    <div className={classes.Categories}>
                        {categories}
                    </div>
                    <div className={classes.Results}>
                        {products}
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        serverURL: state.env.serverURL,
        query: state.products.query,
        data: state.products.data,
        error: state.products.error,
        loading: state.products.loading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onProductsClean: () => dispatch(actions.productsClean()),
        onProductsGetList: (query, serverURL) => dispatch(actions.productsGetList(query, serverURL)),
        onProductsResetError: () => dispatch(actions.productsResetError())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchResult);