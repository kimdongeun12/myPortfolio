'use client';

import { App, Button, Card, Empty, Input, Segmented, Select, Space, Spin, Typography } from 'antd';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { getErrorMessage } from '../../api/client';
import {
  createAdminComment,
  fetchCommentTargets,
  fetchComments,
  type AdminComment,
  type CommentTarget,
  type CommentTargetType,
} from '../../api/comments';
import AdminPageHeader from '../AdminPageHeader';

import AdminCommentItem from './AdminCommentItem';

const MAX_LENGTH = 1000;

const countAll = (comments: AdminComment[]) =>
  comments.reduce((sum, c) => sum + (c.deleted ? 0 : 1) + c.replies.filter((r) => !r.deleted).length, 0);

const parseType = (value: string | null): CommentTargetType => (value === 'PROJECT' ? 'PROJECT' : 'BLOG');

/**
 * 댓글 관리
 * - 블로그/프로젝트를 골라 댓글을 보고, 관리자 댓글·답글 작성, 수정(관리자 댓글만), 숨김 처리
 * - 주소에 ?targetType=BLOG&targetId=3 을 붙이면 해당 글의 댓글로 바로 이동
 */
export default function CommentAdmin() {
  const { message } = App.useApp();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const targetType = parseType(searchParams.get('targetType'));
  const targetIdParam = Number(searchParams.get('targetId'));
  const targetId = Number.isInteger(targetIdParam) && targetIdParam > 0 ? targetIdParam : undefined;

  const [targets, setTargets] = useState<CommentTarget[]>([]);
  const [targetsLoading, setTargetsLoading] = useState(false);
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  /** 선택 상태를 주소에 저장 (새로고침해도 유지) */
  const select = (type: CommentTargetType, id?: number) => {
    const params = new URLSearchParams({ targetType: type });
    if (id) params.set('targetId', String(id));
    router.replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    setTargetsLoading(true);
    fetchCommentTargets(targetType)
      .then(setTargets)
      .catch((error) => message.error(getErrorMessage(error, '목록을 불러오지 못했습니다.')))
      .finally(() => setTargetsLoading(false));
  }, [targetType, message]);

  const loadComments = useCallback(async () => {
    if (!targetId) {
      setComments([]);
      return;
    }
    setCommentsLoading(true);
    try {
      setComments(await fetchComments(targetType, targetId));
    } catch (error) {
      setComments([]);
      message.error(getErrorMessage(error, '댓글을 불러오지 못했습니다.'));
    } finally {
      setCommentsLoading(false);
    }
  }, [targetType, targetId, message]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleCreate = async () => {
    if (!targetId || !newContent.trim()) return;
    setSubmitting(true);
    try {
      await createAdminComment({ targetType, targetId, content: newContent.trim() });
      setNewContent('');
      message.success('댓글을 등록했습니다.');
      loadComments();
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const selectedTitle = targets.find((t) => t.id === targetId)?.title;

  return (
    <>
      <AdminPageHeader title='댓글 관리' description='관리자 댓글은 사이트에 "작성자"로 표시됩니다.' />

      <Card className='admin-block'>
        <Space wrap size={12} className='admin-full-width'>
          <Segmented<CommentTargetType>
            value={targetType}
            onChange={(type) => select(type)}
            options={[
              { label: '블로그', value: 'BLOG' },
              { label: '프로젝트', value: 'PROJECT' },
            ]}
          />
          <Select
            showSearch
            allowClear
            style={{ minWidth: 320 }}
            placeholder={targetType === 'BLOG' ? '공개된 블로그 글 선택' : '프로젝트 선택'}
            loading={targetsLoading}
            value={targetId}
            onChange={(id?: number) => select(targetType, id)}
            optionFilterProp='label'
            options={targets.map((t) => ({ value: t.id, label: t.title }))}
            notFoundContent={targetsLoading ? <Spin size='small' /> : '항목이 없습니다'}
          />
        </Space>
      </Card>

      {!targetId ? (
        <Card>
          <Empty description='댓글을 볼 블로그 글이나 프로젝트를 선택하세요.' />
        </Card>
      ) : (
        <Card title={selectedTitle ? `${selectedTitle} · 댓글 ${countAll(comments)}` : `댓글 ${countAll(comments)}`}>
          <div className='admin-block'>
            <Input.TextArea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder='관리자 댓글 작성'
              autoSize={{ minRows: 2, maxRows: 6 }}
              maxLength={MAX_LENGTH}
              showCount
            />
            <Space style={{ marginTop: 8 }}>
              <Button type='primary' onClick={handleCreate} loading={submitting} disabled={!newContent.trim()}>
                댓글 등록
              </Button>
            </Space>
          </div>

          <Spin spinning={commentsLoading}>
            {comments.length === 0 ? (
              <Empty description='아직 댓글이 없습니다.' />
            ) : (
              <div>
                {comments.map((comment) => (
                  <div key={comment.id}>
                    <AdminCommentItem comment={comment} onChanged={loadComments} />
                    {comment.replies.map((reply) => (
                      <AdminCommentItem key={reply.id} comment={reply} isReply onChanged={loadComments} />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </Spin>
          <Typography.Paragraph type='secondary' style={{ marginTop: 16, marginBottom: 0 }}>
            숨김 처리된 답글은 목록에서 빠지고, 답글이 남아 있는 댓글은 &quot;삭제된 댓글입니다.&quot;로 표시됩니다.
          </Typography.Paragraph>
        </Card>
      )}
    </>
  );
}
