'use client';

import {
  CommentOutlined,
  DashboardOutlined,
  EditOutlined,
  ExportOutlined,
  IdcardOutlined,
  LogoutOutlined,
  ProjectOutlined,
} from '@ant-design/icons';
import { App, Button, Layout, Menu, Result, Space, Spin } from 'antd';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';

import { fetchIsLoggedIn, logout } from '../api/auth';
import { getErrorMessage } from '../api/client';

const { Sider, Header, Content } = Layout;

/** 공개 사이트 주소 ("사이트 보기" 버튼) — 배포 환경변수 NEXT_PUBLIC_SITE_URL */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

/** 사이드 메뉴 — 기능 브랜치에서 메뉴를 고치지 않도록 전체 메뉴를 여기서 정의 */
const MENU_ITEMS = [
  { key: '/admin', icon: <DashboardOutlined />, label: '대시보드' },
  { key: '/admin/experiences', icon: <IdcardOutlined />, label: '경력' },
  { key: '/admin/projects', icon: <ProjectOutlined />, label: '프로젝트' },
  { key: '/admin/blogs', icon: <EditOutlined />, label: '블로그' },
  { key: '/admin/comments', icon: <CommentOutlined />, label: '댓글' },
];

/** 현재 경로에 맞는 메뉴 (예: /admin/blogs/3 → /admin/blogs) */
const getSelectedKey = (pathname: string) =>
  MENU_ITEMS.map((item) => item.key)
    .filter((key) => (key === '/admin' ? pathname === '/admin' : pathname.startsWith(key)))
    .sort((a, b) => b.length - a.length)[0] ?? '/admin';

type AuthStatus = 'checking' | 'ok' | 'error';

/**
 * 어드민 화면 틀 (로그인 확인 + 사이드 메뉴 + 상단 바)
 */
export default function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { message } = App.useApp();
  const [status, setStatus] = useState<AuthStatus>('checking');
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetchIsLoggedIn()
      .then((loggedIn) => {
        if (cancelled) return;
        if (loggedIn) setStatus('ok');
        else router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
      })
      .catch((error) => {
        if (cancelled) return;
        setErrorText(getErrorMessage(error));
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
    // 최초 진입 시 한 번만 확인 (이후 401 은 각 요청에서 안내)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      router.replace('/admin/login');
    }
  };

  if (status === 'checking') {
    return (
      <div className='admin-center'>
        <Spin size='large' tip='로그인 확인 중' >
          <div className='admin-spin-space' />
        </Spin>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className='admin-center'>
        <Result
          status='warning'
          title='어드민을 불러올 수 없습니다'
          subTitle={errorText}
          extra={<Button onClick={() => window.location.reload()}>다시 시도</Button>}
        />
      </div>
    );
  }

  return (
    <Layout className='admin-layout'>
      <Sider breakpoint='lg' collapsedWidth={0} width={220} theme='light' className='admin-sider'>
        <Link href='/admin' className='admin-logo'>
          Portfolio Admin
        </Link>
        <Menu
          mode='inline'
          selectedKeys={[getSelectedKey(pathname)]}
          items={MENU_ITEMS}
          onClick={({ key }) => router.push(key)}
        />
      </Sider>
      <Layout>
        <Header className='admin-header'>
          <Space>
            <Button type='text' icon={<ExportOutlined />} href={SITE_URL} target='_blank' rel='noopener noreferrer'>
              사이트 보기
            </Button>
            <Button type='text' icon={<LogoutOutlined />} onClick={handleLogout}>
              로그아웃
            </Button>
          </Space>
        </Header>
        <Content className='admin-content'>{children}</Content>
      </Layout>
    </Layout>
  );
}
