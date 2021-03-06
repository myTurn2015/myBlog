import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';

import Dialog from 'react-toolbox/lib/dialog';
import FontIcon from 'react-toolbox/lib/font_icon';
import { Button, IconButton } from 'react-toolbox/lib/button';
import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from 'react-toolbox/lib/list';
import Tooltip from 'react-toolbox/lib/tooltip';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import { Snackbar } from 'react-toolbox/lib/snackbar';
import Input from 'react-toolbox/lib/input';

import styles from '../../styles/site';
import { fetchArticles, delArticleById } from '../../actions/article';
import { resetPasswd } from '../../actions/user';


const TooltipButton = Tooltip(IconButton);

class ArticleList extends Component {
    /**
     * 组件初始化时，判断文章数据是从props中来，还是需要请求数据
     * 1 如果list.length === 0, 则请求文章数据
     * 2 list.length !== 0   
     */
    constructor(props) {
        super(props);
        this.state = {
            pageNum: 1,
            pageSize: 20,
            fetched: false,
            showDialog: false,
            title: '',
            id: '',
            active: false,
        };
    }

    async componentDidMount() {
        
    }

    render() {

        return (
            <div>
                <aside className={styles.createArticle}>
                    <Link to='/admin/article/create'><Button raised><FontIcon value="edit" /> 新增</Button></Link>
                </aside>
                <div>
                    {this.renderArticles(this.props.list)}
                    {!this.props.isFetching && this.props.list.length === 0 ? <p>还没写过文章</p> : false}
                    {this.props.isFetching ? <ProgressBar type='circular' mode='indeterminate' /> : false}
                </div>
                <Dialog
                    actions={this.actions}
                    active={this.state.showDialog}
                    onOverlayClick={this.cancelDialog}
                    title='确认删除文章'>
                    <p>{this.state.title}</p>
                </Dialog>
                <Snackbar action='Dismiss' label={this.props.message.text} active={this.state.active} timeout={3000} onTimeout={this.SnackbarTimeout} />
            </div>
        );
    }

    actions = [
        { label: '取消', onClick: this.cancelDialog.bind(this) },
        { label: '删除', onClick: this.ensureDelArticle.bind(this) }
    ];

    /**
     * 显示文章列表
     */
    renderArticles(articles) {
        let len = articles.length;
        if (len === 0) {
            return false;
        }

        let nodes = articles.map((article, i) => {
            let id = article._id;
            return (
                <ListItem
                    key={i}
                    className={styles.bb}
                    onClick={this.checkArticle.bind(this, id)} 
                    caption={article.title} 
                    rightActions={[
                        <TooltipButton tooltip='编辑' key={i} onClick={this.editArticle.bind(this, id)} icon='edit' />,
                        <TooltipButton tooltip='删除' key={i} onClick={this.delArticle.bind(this, id, article.title)} icon='delete' />
                ]} />
            )
        });

        return (
            <List>{nodes}</List>
        );
    }

    // 查看文章详情
    checkArticle(id) {
        browserHistory.push(`/admin/article/${id}`);
    }

    // 编辑文章
    editArticle(id) {
        event.stopPropagation();
        browserHistory.push(`/admin/article/edit/${id}`);
    }

    // 删除文章
    delArticle(id, title) {
        event.stopPropagation();
        this.setState({
            ...this.state,
            showDialog: true,
            id,
            title,
        })
    }

    async ensureDelArticle() {
        let res = await this.props.delArticleById(this.state.id);
        this.setState({
            ...this.state,
            active: true
        });
        this.cancelDialog();
    }

    /**
     * 关闭对话框
     */
    cancelDialog() {
        this.setState({
            ...this.state,
            showDialog: false,
        });
    }

    SnackbarTimeout = () => {
        this.setState({
            ...this.state,
            active: false,
        });
    }
}

/**
 * isFetching, message, pagination, list
 */
const mapStateToProps = state => {
    return {
        ...state.articles
     };
}

export default connect(mapStateToProps, { fetchArticles, delArticleById, resetPasswd })(ArticleList);
