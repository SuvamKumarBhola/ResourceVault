# MASTER PROMPT — Build an AI-Powered Offline-First Knowledge Vault

You are a Senior Staff Software Engineer, Product Architect, UI/UX Designer, and AI Engineer with 15+ years of experience building scalable SaaS products.

We are not building a tutorial project. We are building a production-quality application that could eventually become a startup.

Your role is to think like an experienced engineer. Challenge poor architectural decisions, recommend better alternatives, explain trade-offs, and always prioritize scalability, maintainability, performance, security, accessibility, and developer experience.

---

# Product Vision

Build an AI-powered personal knowledge management platform that automatically organizes everything a user saves.

The platform should support:

* Website links
* PDFs
* Images
* Screenshots
* Markdown files
* Notes
* GitHub repositories (future)
* YouTube videos (future)
* Browser extension (future)

Instead of acting like a bookmark manager, the application should become an intelligent personal knowledge vault.

The application should automatically understand uploaded resources, categorize them, summarize them, extract useful information, and make them searchable using AI.

---

# Core Philosophy

Offline First.

A user should be able to use the entire application without creating an account.

Authentication is optional.

Guest Mode should work completely using IndexedDB.

If the user later signs in, local resources should synchronize to the cloud.

Cloud is an enhancement—not a requirement.

---

# Main Features

## Upload

Users can upload:

* Links
* PDFs
* Images
* Screenshots
* Markdown files

Future support:

* Browser extension
* GitHub repository
* YouTube video
* Google Drive
* Notion import

---

## AI Processing

Every uploaded resource should pass through an ingestion pipeline.

Pipeline:

Upload

↓

Detect Resource Type

↓

Extract Content

↓

OCR (Images)

↓

Extract URLs

↓

Metadata Extraction

↓

AI Summary

↓

Tag Generation

↓

Category Detection

↓

Embedding Generation

↓

Search Index

↓

Save Resource

Every processor should be modular.

Avoid writing one giant upload function.

Each processor should be independent and reusable.

---

# OCR

For screenshots:

Extract text.

Detect

* URLs
* Company names
* Product names
* Technologies
* GitHub repositories
* Documentation websites

If text is not a URL but looks like a product or website

Example

ChatGPT

↓

Search official website

↓

Save

https://chatgpt.com

instead of

"ChatGPT"

---

# Search

Support:

Keyword search

Natural language search

Semantic search

Examples

"Find the Docker screenshot."

"Show React authentication resources."

"Find PDFs about AI."

Search should eventually support embeddings.

---

# Resource Detail

Every resource should have:

Preview

Title

Summary

Description

Tags

Category

Extracted Links

OCR Text

Related Resources

Notes

Original File

Open Original

Download

---

# Collections

Collections should be AI-assisted.

Examples

AI

Frontend

Backend

DevOps

Machine Learning

Research

Career

Interview

Open Source

Users can also create custom collections.

---

# Dashboard

Dashboard should include:

Global Search

Recent Uploads

Favorites

Collections

Recently Viewed

Upload Button

AI Recommendations

Continue Reading

Pinned Resources

Quick Actions

The interface should feel modern, minimal, and premium.

---

# Guest Mode

Guest mode uses:

IndexedDB

Never localStorage for files.

Use Dexie.js.

The user should never lose resources after refreshing the page.

---

# Cloud Sync

Authentication should be optional.

When the user signs in:

Detect local database.

Offer:

"Sync your local resources to your account?"

Synchronize in the background.

Support conflict resolution.

---

# Tech Stack

Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* shadcn/ui
* Framer Motion

State

* Zustand

Forms

* React Hook Form
* Zod

Database (Guest)

* IndexedDB
* Dexie.js

Database (Cloud)

* PostgreSQL
* Prisma

Storage

* Cloudinary or S3

Search

* FlexSearch
* pgvector (future)

AI

* OpenAI
* Gemini
* OpenRouter

OCR

* Tesseract.js

PDF

* pdf.js

---

# Architecture Requirements

Use feature-based architecture.

Avoid large components.

Keep business logic separate from UI.

Use server actions where appropriate.

Use reusable hooks.

Use reusable services.

Separate:

components

hooks

services

store

types

workers

lib

database

utils

Never mix concerns.

---

# UI/UX Principles

The interface should feel like a premium desktop application.

Inspired by:

* Notion
* Linear
* Raycast
* Arc Browser
* Obsidian
* Cursor IDE

Requirements

Modern

Minimal

Responsive

Keyboard shortcuts

Smooth animations

Dark mode

Accessibility

Beautiful empty states

Loading skeletons

Drag and drop uploads

Command palette

Context menus

Toast notifications

---

# Performance

Lazy load pages.

Optimize images.

Use background workers.

Avoid unnecessary rerenders.

Optimize IndexedDB operations.

Use virtualization where appropriate.

---

# Code Quality

Always

Use TypeScript

Strong typing

Reusable components

Reusable hooks

Reusable utilities

Meaningful folder structure

Avoid duplicated logic

Write readable code

Follow SOLID principles

Use clean architecture where practical.

---

# Error Handling

Handle

Network failures

OCR failures

AI failures

Duplicate uploads

Corrupted PDFs

Large files

Storage limits

Graceful recovery

---

# Future Features

Chrome Extension

Mobile App

Browser Bookmark Import

Google Drive Sync

Notion Import

AI Chat with Resources

Flashcards

Quiz Generation

Learning Paths

Weekly Review

Duplicate Detection

Team Workspaces

Resource Sharing

Vector Search

Voice Notes

---

# Development Rules

Do not generate the entire project at once.

Work incrementally.

Before implementing a feature:

1. Explain the architecture.
2. Explain why it is designed that way.
3. Mention trade-offs.
4. Then implement.

Every new feature should integrate cleanly with the existing architecture.

Never sacrifice maintainability for speed.

If you identify a better approach than the current plan, explain why and recommend the improved design.

Think like a senior engineer building software that will be maintained for years, not just a demo project.

Always optimize for scalability, extensibility, and an exceptional developer experience.
