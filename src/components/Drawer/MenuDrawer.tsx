import React, { useState } from 'react';
import type { DrawerProps, RadioChangeEvent } from 'antd';
import { Button, Drawer, Space } from 'antd';
import s from './MenuDrawer.module.scss';

const CATEGORIES = [
    'Architecture', 'Art & fashion', 'Biography', 'Business', 'Drama', 'Fiction', 'Food & Drink',
    'Health & Wellbeing', 'History & Politics', 'Humor', 'Poetry', 'Psychology', 'Science', 'Technology',
    'Travel & Maps'
]

export default function MenuDrawer() {
    const [open, setOpen] = useState(false);
    const [placement, setPlacement] = useState<DrawerProps['placement']>('left');

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Space>
                <div className={s.button}>
                    <Button type="primary" onClick={showDrawer}>
                        Categories
                    </Button>
                </div>
            </Space>
            <Drawer
                title="Basic Drawer"
                placement={placement}
                closable={false}
                onClose={onClose}
                open={open}
                key={placement}
            >
                <Button type="text">Architecture</Button>
            </Drawer>
        </>
    );
}