import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import './styles.scss';
import List from './components/list';
import * as Pages from './pages';
import Models from './models';
import {PrivateRoute} from './components';
import Item from './components/item';
import {IModel} from './interfaces/system';

function App() {
    let routes: Array<React.ReactElement> = [];
    let model: IModel<any>;
    for (let index = 0; index < Models.length; index++) {
        model = Models[index].model;
        routes.push(<PrivateRoute key={'add_' + index} path={'/' + model.route + '/add'}>
            <Item key={'add_' + index} model={model}/>
        </PrivateRoute>);
        routes.push(<PrivateRoute key={'edit_' + index} path={'/' + model.route + '/:id'}>
            <Item key={'edit_' + index} model={model}/>
        </PrivateRoute>);
        routes.push(<PrivateRoute key={'list_' + index} path={'/' + model.route}>
            <List model={model}/>
        </PrivateRoute>);
    }

    return (
        <Router>
            <Switch>
                <>
                    <Route path={'/login'} component={Pages.Login}/>
                    <PrivateRoute exact path={'/'} component={Pages.Home}/>
                    <PrivateRoute exact path={'/change_password'} component={Pages.ChangePassword}/>
                    {routes}
                </>
            </Switch>
        </Router>
    );
}

export default App;
