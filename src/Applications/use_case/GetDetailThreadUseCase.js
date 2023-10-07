/* eslint-disable no-restricted-syntax */
const DetailComment = require('../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../Domains/replies/entities/DetailReply');
const DetailThread = require('../../Domains/threads/entities/DetailThread');

class GetDetailThreadUseCase {
  constructor({
    commentRepository,
    threadRepository,
    replyRepository,
    likeRepository,
  }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    const theThread = new DetailThread(useCasePayload);

    await this._threadRepository.findThreadById(theThread.thread);
    const detailThread = await this._threadRepository.getDetailThread(
      theThread.thread
    );
    const commentThread = await this._commentRepository.getCommentsThread(
      theThread
    );
    const replyCommentThread = await this._replyRepository.getReplyThread(
      theThread
    );

    const result = [];

    const filterComments = new DetailComment({
      comments: commentThread,
    });

    function combineCommentsAndReplies(comment, replies) {
      const combined = { ...comment };
      const commentReplies = replies.filter(
        (reply) => reply.comment === comment.id
      );

      if (commentReplies.length > 0) {
        combined.replies = new DetailReply({
          replies: commentReplies,
        }).replies;
      }
      return combined;
    }

    for await (const comment of filterComments.comments) {
      const combinedComment = combineCommentsAndReplies(
        comment,
        replyCommentThread
      );
      if (!combinedComment.replies) {
        combinedComment.replies = [];
      }
      combinedComment.likeCount = await this._likeRepository.getLikeComment(
        comment.id
      );
      result.push(combinedComment);
    }

    return {
      thread: { ...detailThread, comments: result },
    };
  }
}

module.exports = GetDetailThreadUseCase;
