import {
  selectBodyProperty,
  initializeArray,
  addElement,
  removeElement,
  clearArray,
} from "../bodySlice"
import { createTagOptions } from "../../../util/body-util"
import Button from "../../../components/Button"
import Arrow from "../../../components/Arrow"
import "./TagsInput.css"

import { useEffect, useState } from "react"
import { MdCreate, MdOutlineClear, MdOutlineAddCircle } from "react-icons/md"
import { useSelector, useDispatch } from "react-redux"

const genderTags = ["men", "women", "unisex"]
const pieceTags = ["1-pc", "2-pc", "3-pc", "4-pc"]
const allTags = { genderTags, pieceTags }

export default function TagsInput() {
  const dispatch = useDispatch()
  const tags = useSelector(selectBodyProperty("tags")) || []
  const [newTag, setNewTag] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [tagsOn, setTagsOn] = useState(false)

  useEffect(() => {
    if (tags.length === 0 && tagsOn) {
      dispatch(initializeArray("tags"))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags, tagsOn])

  const onAddTag = (tag, tagType) => () => {
    if (tagsOn === false) return
    let isUnique

    if (tagType) {
      const typeOfTags = allTags[tagType]
      isUnique = tags.every((selectedTag) => !typeOfTags.includes(selectedTag))
    } else {
      isUnique = tags.every((selectedTag) => selectedTag !== tag)
    }

    if (isUnique) dispatch(addElement({ property: "tags", element: tag }))
  }

  const onRemoveValue = (tagToRemove) => () =>
    dispatch(removeElement({ property: "tags", element: tagToRemove }))

  const clear = () => dispatch(clearArray("tags"))

  const tagOptions = createTagOptions(tags, onAddTag, allTags)

  return (
    <div className="input-switch">
      <Button
        type="button"
        className="input-switch-button"
        onClick={() => {
          clear()
          setTagsOn(!tagsOn)
        }}
        text={tagsOn ? "Tags On" : "Tags Off"}
      />
      <input className="tags" value={tags} readOnly hidden></input>
      <div className="tags-input-container">
        <div className={"custom-select"}>
          <div className={"select-box" + (!tagsOn ? " disabled" : "")}>
            <div className="selected-options">
              {tags?.map((selectedTag) => (
                <span className="tag" key={selectedTag}>
                  {selectedTag}
                  <span
                    className="remove-tag"
                    onClick={onRemoveValue(selectedTag)}
                  >
                    &times;
                  </span>
                </span>
              ))}
            </div>
            <Arrow state={isOpen} onClick={() => setIsOpen(!isOpen)} />
          </div>
          <div className={"options" + (isOpen ? " open" : "")}>
            <div className="make-tag-container">
              <div className="make-tag-box">
                {newTag?.length > 0 ? (
                  <Button
                    onClick={() => setNewTag("")}
                    type="button"
                    className="tag-input-clear-button"
                    icon={<MdOutlineClear />}
                  />
                ) : (
                  <div className="create-icon">
                    <MdCreate />
                  </div>
                )}
                <input
                  className="tag-input"
                  type="text"
                  value={newTag}
                  onChange={({ target }) => setNewTag(target.value)}
                  placeholder="Create a new tag"
                />
                {newTag?.length > 0 && (
                  <Button
                    type="button"
                    className="add-tag-button"
                    onClick={onAddTag(newTag)}
                    icon={<MdOutlineAddCircle size={26} />}
                    disabled={tagsOn === false}
                  />
                )}
              </div>
            </div>
            {tagOptions}
          </div>
        </div>
      </div>
    </div>
  )
}
