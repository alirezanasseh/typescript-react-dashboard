import React from 'react';
import Layout from '../layout';
import Models from '../models';
import './styles.scss';
import * as Icons from 'react-icons/all';

export default function Home() {
    return (
        <Layout>
            <h1 className={'home-heading'}>Admin Dashboard</h1>
            <div className={'home-pages'}>
                {Models.map(model => {
                    const Icon = model.icon ? Icons[model.icon as keyof typeof Icons] : 'div';
                    return <a className={'home-page'} href={model.model.route}>
                        {model.icon && <div className={'icon'}><Icon/></div>}
                        <div>{model.model.title}</div>
                    </a>
                })}
            </div>
        </Layout>
    );
}