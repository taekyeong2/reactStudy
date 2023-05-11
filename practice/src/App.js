import logo from './logo.svg';
import './App.css';
import { useState } from 'react';


//컴포넌트(사용자 정의 태그) => 대문자로 시작
//prop(속성) => 컴포넌트를 사용하는 외부자를 위함
//state => 컴포넌트를 만드는 내부자를 위함(const선언)
function Header(props){
  console.log('props', props, props.title)
  return <header>
          <h1>
            <a href='/' onClick={(event)=>{
              event.preventDefault();
              props.onCangeMode();
            }}>
              {props.title}
            </a>
          </h1>
        </header>
}
function Nav(props){
  const lis = []
  for(let i=0; i<props.topics.length; i++){
    let t = props.topics[i];
    //key => react에서 자동으로 생성한 태그를 추척하기 위한 근거
    //숫자여도 태그의 속성으로 넘기면 문자열이 된다.
    lis.push(<li key={t.id}>
                <a id={t.id} href={'/read/'+t.id} onClick={(event)=>{
                  event.preventDefault();
                  props.onCangeMode(Number(event.target.id));
                }}>{t.title}</a>
              </li>)
  }
  return <nav>
          <ol>
            {lis}
          </ol>
        </nav>
}
function Article(props){
  return <article>
            <h2>{props.title}</h2>
            {props.body}
          </article>
}
function Create(props){
  return <article>
          <h2>Create</h2>
          <form onSubmit={(event)=>{
            event.preventDefault();
            const title = event.target.title.value;
            const body = event.target.body.value;
            props.onCreate(title, body)
          }}>
            <p><input type='text' name='title' placeholder='title'/></p>
            <p><textarea name='body' placeholder='body'></textarea></p>
            <p><input type='submit' value='create'></input></p>
          </form>
        </article>
}
function Update(props){
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return <article>
          <h2>Update</h2>
          <form onSubmit={(event)=>{
            event.preventDefault();
            const title = event.target.title.value;
            const body = event.target.body.value;
            props.onUpdate(title, body)
          }}>
            <p><input type='text' name='title' placeholder='title' value={title} onChange={(event)=>{
              console.log(event.target.value)
              setTitle(event.target.value)
            }}/></p>
            <p><textarea name='body' placeholder='body' value={body} onChange={(event)=>{
              setBody(event.target.value)
            }}></textarea></p>
            <p><input type='submit' value='Update'></input></p>
          </form>
        </article>  
}
function App() {
  //함수안에서는 바뀌지 않기때문에 const(상수) => 변수값을 뒤에서 바꿀수 없다.
  /*  const _mode = useState('WELCOME') -> ()안 초기값
      const mode = _mode[0]; -> 0: state처음 값
      const setMode = _mode[1]; -> 1: 바뀔값  */
  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4)
  const [topics, setTopics] = useState([
    {id:1, title:'html', body:'html is ...'},
    {id:2, title:'css', body:'css is ...'},
    {id:3, title:'javascript', body:'javascript is ...'}
  ])
  let content = null;
  let contextControl = null;
  if(mode === 'WELCOME'){
    content = <Article title="WELCOM" body="Hello, WEB"></Article>

  } else if(mode === 'READ'){
    let title, body = null;
    for(let i=0; i<topics.length; i++){
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body
      }
    }
    content = <Article title={title} body={body}></Article>
    contextControl = <>
                      <li><a href={'/update/'+id} onClick={(event)=>{
                        event.preventDefault();
                        setMode('UPDATE')
                      }}>Update</a></li>
                      <li><input type='button' value="Delete" onClick={()=>{
                        const newTopics = []
                        for(let i=0; i<topics.length; i++){
                          if(topics[i].id !== id){
                            newTopics.push(topics[i]);
                          }
                        }
                        setTopics(newTopics)
                        setMode('WELCOME')
                      }}></input></li>
                    </>
  } else if(mode === 'CREATE'){
    content = <Create onCreate={(_title, _body)=>{
                const newTopic = {id:nextId, title:_title, body:_body}
                const newTopics = [...topics]
                newTopics.push(newTopic);
                setTopics(newTopics);
                setMode('READ');
                setId(nextId);
                setNextId(nextId+1);
              }}></Create>
  } else if(mode == 'UPDATE'){
    let title, body = null;
    for(let i=0; i<topics.length; i++){
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body
      }
    }
    content = <Update title={title} body={body} onUpdate={(title, body)=>{
                console.log(title, body);
                const newTopics = [...topics]
                const updatedTopic = {id:id, title:title, body:body}
                for(let i=0; i<newTopics.length; i++){
                  if(newTopics[i].id === id){
                    newTopics[i] = updatedTopic;
                    break;
                  }
                }
                setTopics(newTopics)
                setMode('READ')
              }}></Update>
  }
  return (
    <div>
      <Header title="WEB" onCangeMode={()=>{
        setMode('WELCOME');
      }}></Header>
      <Nav topics={topics} onCangeMode={(_id)=>{
       setMode('READ');
       setId(_id)
      }}></Nav>
      {content}
      <ul>
        <li><a href='/creat' onClick={(event)=>{
          event.preventDefault();
          setMode('CREATE')
        }}>Create</a></li>
        {contextControl}
      </ul>
    </div>
  );
}

export default App;


/*
-원시데이터일경우(string, number, boolea, null 등..)
const[value, setValue] = useState(PRIMITIVE) 

-범객체일경우(object, array  등..)
const[value, setValue] = useState(Object)

newValue = {...value} | [...value]  -> value값 복제한 후
newValue 변경
setValue(newValue)  ==> 컴포넌트가 다시 실행
*/