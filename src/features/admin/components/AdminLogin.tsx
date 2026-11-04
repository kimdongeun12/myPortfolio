'use client';

import { LockOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Form, Input, Typography } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { fetchIsLoggedIn, login } from '../api/auth';
import { getErrorMessage } from '../api/client';

type LoginForm = { password: string };

const getSafeNext = (next: string | null) =>
  next && next.startsWith('/admin') && !next.startsWith('//') ? next : '/admin';

export default function AdminLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = getSafeNext(searchParams.get('next'));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchIsLoggedIn()
      .then((loggedIn) => loggedIn && router.replace(next))
      .catch(() => undefined);
  }, [next, router]);

  const handleFinish = async ({ password }: LoginForm) => {
    setSubmitting(true);
    setError('');
    try {
      await login(password);
      router.replace(next);
    } catch (e) {
      setError(getErrorMessage(e, '로그인에 실패했습니다.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='admin-center admin-login'>
      <Card className='admin-login-card'>
        <Typography.Title level={3}>Portfolio Admin</Typography.Title>
        <Typography.Paragraph type='secondary'>관리자 비밀번호를 입력하세요.</Typography.Paragraph>

        {error && <Alert className='admin-login-error' type='error' message={error} showIcon />}

        <Form<LoginForm> layout='vertical' onFinish={handleFinish} requiredMark={false}>
          <Form.Item name='password' label='비밀번호' rules={[{ required: true, message: '비밀번호를 입력하세요.' }]}>
            <Input.Password prefix={<LockOutlined />} autoComplete='current-password' autoFocus />
          </Form.Item>
          <Button type='primary' htmlType='submit' block loading={submitting}>
            로그인
          </Button>
        </Form>
      </Card>
    </div>
  );
}
