package static

import "embed"

//go:embed templates/*
var TemplatesEmbed embed.FS

//go:embed js/* cdn/* css/* images/* upload/*
var JsEmbed embed.FS
