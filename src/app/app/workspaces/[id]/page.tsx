"use client"; import { useParams } from "next/navigation"; import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; import { api } from "@/lib/api/services"; import { LoadingState, EmptyState, ErrorState } from "@/components/PageStates"; import { Button } from "@/components/ui/button"; import { Input } from "@/components/ui/input"; import { Textarea } from "@/components/ui/textarea"; import { Label } from "@/components/ui/label"; import { Badge } from "@/components/ui/badge"; import { useState, useRef } from "react";
import { ResearchToolOutput } from "@/components/ResearchToolOutput";
import { ModelSelector } from "@/components/ai/ModelSelector";
import { useAiModel } from "@/components/ai/useAiModel";
import { AnswerCard, type AnswerCitation } from "@/components/ai/AnswerCard";
import type { AiModelChoice } from "@/components/ai/models";
import { SourceSelector } from "@/components/ai/SourceSelector";
import { useSourceMode } from "@/components/ai/useSourceMode";
export default function WorkspaceDetail(){const {id}=useParams<{id:string}>();const qc=useQueryClient();const ws=useQuery({queryKey:["workspace",id],queryFn:()=>api.workspace(id)});const docs=useQuery({queryKey:["ws-docs",id],queryFn:()=>api.wsDocuments(id)});const convs=useQuery({queryKey:["convs",id],queryFn:()=>api.conversations(id)});
 const [question,setQuestion]=useState("");const [answer,setAnswer]=useState("");const [citations,setCitations]=useState<AnswerCitation[]>([]);const [toolOut,setToolOut]=useState("");const [toolData,setToolData]=useState<Record<string,any>|null>(null);const [aiModel,setAiModel]=useAiModel();const [sourceMode,setSourceMode]=useSourceMode();const [chatMeta,setChatMeta]=useState<{requested:AiModelChoice;providerUsed:string;fallbackUsed:boolean}|null>(null);const [toolMeta,setToolMeta]=useState<{requested:AiModelChoice;providerUsed:string;fallbackUsed:boolean}|null>(null);const fileRef=useRef<HTMLInputElement>(null);
 const upload=useMutation({mutationFn:(f:File)=>api.uploadDocument(id,f),onSuccess:(d)=>{qc.invalidateQueries({queryKey:["ws-docs",id]});const did=(d as {id?:string})?.id;if(did) indexM.mutate(did);}});
 const indexM=useMutation({mutationFn:(did:string)=>api.docIndex(id,did),onSuccess:()=>qc.invalidateQueries({queryKey:["ws-docs",id]})});
 const chatM=useMutation({mutationFn:()=>api.chat(id,{message: question,model: aiModel,source_mode: sourceMode}),onSuccess:(d)=>{setAnswer((d.answer||d.response||"") as string);setCitations((d.citations||[]) as AnswerCitation[]);const r=d as Record<string,unknown>;setChatMeta(r.provider_used?{requested:aiModel,providerUsed:r.provider_used as string,fallbackUsed:!!r.fallback_used}:null);qc.invalidateQueries({queryKey:["convs",id]});}});
 const toolM=useMutation({mutationFn:(tool:string)=>api.research(id,tool,{question:question||"Summarize the key findings",model: aiModel,source_mode: sourceMode}),onSuccess:(d,tool)=>{setToolOut(tool as string);setToolData(d as Record<string,any>);const r=d as Record<string,unknown>;setToolMeta(r.provider_used?{requested:aiModel,providerUsed:r.provider_used as string,fallbackUsed:!!r.fallback_used}:null);}});
 const toolTitle=toolOut==="summary"?"Summary":toolOut==="key-points"?"Key points":toolOut==="questions"?"Practice questions":toolOut==="flashcards"?"Flashcards":"Research";
 const delConv=useMutation({mutationFn:(cid:string)=>api.deleteConversation(id,cid),onSuccess:()=>qc.invalidateQueries({queryKey:["convs",id]})});
 if(ws.isLoading||docs.isLoading) return <LoadingState/>; if(ws.error) return <ErrorState message="Workspace not found or access denied" />;
 return <div><p className="text-xs text-zinc-500"><a href="/app/workspaces" className="hover:underline">Workspaces</a> / {ws.data?.name}</p><h1 className="mt-2 font-display text-2xl font-semibold tracking-tight">{ws.data?.name}</h1>{ws.data?.description&&<p className="mt-1 text-sm text-zinc-500">{ws.data.description}</p>}
 <div className="mt-8 grid gap-8 lg:grid-cols-2"><section><h2 className="text-base font-semibold">Documents</h2>
 <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f)upload.mutate(f);}}/><Button className="mt-3" size="sm" onClick={()=>fileRef.current?.click()} disabled={upload.isPending}>{upload.isPending?"Uploading…":"Upload PDF / DOCX / TXT"}</Button>
 {upload.error&&<p className="mt-2 text-sm text-rose-600">Upload failed. Check file type and size.</p>}
 <div className="mt-4">{!docs.data?.length?<EmptyState title="No documents yet" desc="Upload a paper, then index it for cited answers."/>:<ul className="divide-y divide-zinc-900/[0.06] rounded-lg border border-zinc-900/[0.08] bg-white">{docs.data.map(d=><li key={d.id} className="flex items-center justify-between gap-3 px-4 py-3"><div className="min-w-0"><p className="truncate text-sm font-medium">{d.original_filename||d.filename}</p><p className="text-xs text-zinc-500">{d.file_type} · {d.status}</p></div><Button size="sm" variant="outline" onClick={()=>indexM.mutate(d.id)} disabled={indexM.isPending}>Index</Button>{indexM.error&&<span className="max-w-xs text-xs text-rose-600">Indexing failed: {indexM.error instanceof Error ? indexM.error.message : "unknown error"} — retry.</span>}</li>)}</ul>}</div>
 <h2 className="mt-8 text-base font-semibold">Conversations</h2>{!convs.data?.length?<p className="mt-2 text-sm text-zinc-500">No conversations yet.</p>:<ul className="mt-3 space-y-2">{convs.data.map(c=><li key={c.id} className="flex items-center justify-between rounded-md border border-zinc-900/[0.08] px-3 py-2 text-sm"><span>{c.title||"Untitled"}</span><Button size="sm" variant="ghost" onClick={()=>{if(confirm("Delete this conversation?"))delConv.mutate(c.id);}}>Delete</Button></li>)}</ul>}</section>
 <section><h2 className="text-base font-semibold">Research studio</h2><div className="mt-3 space-y-3"><Label htmlFor="q">Ask your documents</Label><Textarea id="q" rows={4} value={question} onChange={e=>setQuestion(e.target.value)} placeholder="What does the literature say about…?"/><div className="flex flex-wrap items-end gap-x-4 gap-y-2"><div className="flex flex-col gap-1"><span className="text-[11px] font-medium text-zinc-500">Source</span><SourceSelector value={sourceMode} onChange={setSourceMode}/></div><div className="flex flex-col gap-1"><span className="text-[11px] font-medium text-zinc-500">AI</span><ModelSelector value={aiModel} onChange={setAiModel}/></div></div><div className="flex flex-wrap gap-2"><Button onClick={()=>chatM.mutate()} disabled={!question||chatM.isPending}>{chatM.isPending?"Thinking…":"Ask with citations"}</Button>{["summary","key-points","questions","flashcards"].map(t=><Button key={t} variant="outline" size="sm" onClick={()=>toolM.mutate(t)} disabled={toolM.isPending}>{t}</Button>)}</div>
 <div className="mt-1"><AnswerCard
   markdown={answer||undefined}
   citations={citations}
   providerUsed={chatMeta?.providerUsed}
   fallback={chatMeta?.fallbackUsed?{requested:chatMeta.requested,providerUsed:chatMeta.providerUsed}:null}
   copyText={answer||undefined}
   onRegenerate={()=>{if(question&&!chatM.isPending)chatM.mutate();}}
   regenerating={chatM.isPending&&!!answer}
   isLoading={chatM.isPending&&!answer}
   error={chatM.error?"Couldn't answer that yet — try again.":null}
 /></div>
 {toolOut&&toolData?<div className="mt-4"><AnswerCard
   title={toolTitle}
   providerUsed={toolMeta?.providerUsed}
   fallback={toolMeta?.fallbackUsed?{requested:toolMeta.requested,providerUsed:toolMeta.providerUsed}:null}
   copyText={toolOut==="summary"&&toolData.summary?String(toolData.summary):undefined}
   onRegenerate={()=>{if(!toolM.isPending)toolM.mutate(toolOut);}}
   regenerating={toolM.isPending}
   isLoading={toolM.isPending&&!toolData}
   error={toolM.error?"Research failed. Try again in a moment.":null}
 ><ResearchToolOutput tool={toolOut} data={toolData}/></AnswerCard></div>
 :toolM.isPending?<div className="mt-4"><AnswerCard title="Research" isLoading/></div>
 :toolM.error?<div className="mt-4"><AnswerCard title="Research" error="Research failed. Try again in a moment."/></div>:null}</div></section></div></div>;}
